package com.tensura.service;

import com.tensura.config.GameBalanceConfig;
import com.tensura.entity.*;
import com.tensura.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class BattleEngineService {

    private final BattleSessionRepository battleSessionRepository;
    private final PlayerRepository playerRepository;
    private final PlayerSkillRepository playerSkillRepository;
    private final ItemRepository itemRepository;
    private final PredatorService predatorService;
    private final Random random = new Random();

    public static class TurnResult {
        public BattleSession session;
        public boolean battleEnded;
        public boolean playerWon;
        public String actionLog;
        public PredatorService.DevourResult devourResult;
    }

    /**
     * Start a new battle session with a monster.
     */
    @Transactional
    public BattleSession startBattle(Player player, Monster monster, String battleType, int labyrinthFloor) {
        log.info("Starting battle for player [{}] vs [{}] in [{}]", player.getTelegramId(), monster.getName(), battleType);

        // Delete any stale existing session
        battleSessionRepository.deleteByPlayerTelegramId(player.getTelegramId());

        player.setInBattle(true);
        playerRepository.save(player);

        String initialLog = String.format("⚔️ <b>Сражение началось!</b>\nПротивник: <b>%s</b> [%s]\n«Великий Мудрец»: <i>«Обнаружена цель. Анализ параметров завершен. Начинайте бой!»</i>",
                monster.getName(), monster.getRank());

        BattleSession session = BattleSession.builder()
                .playerTelegramId(player.getTelegramId())
                .monsterName(monster.getName())
                .monsterRank(monster.getRank())
                .monsterSpecies(monster.getSpecies())
                .monsterHp(monster.getHp())
                .monsterMaxHp(monster.getMaxHp())
                .monsterAttack(monster.getAttack())
                .monsterDefense(monster.getDefense())
                .monsterAgility(monster.getAgility())
                .expReward(monster.getExpReward())
                .stellasReward(monster.getStellasReward())
                .dropItemName(monster.getDroppedItemName())
                .dropRate(monster.getDropRate())
                .extractableSkill(monster.getExtractableSkillName())
                .round(1)
                .barrierShield(0)
                .battleType(battleType)
                .labyrinthFloor(labyrinthFloor)
                .finished(false)
                .playerWon(false)
                .combatLog(initialLog)
                .startedAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return battleSessionRepository.save(session);
    }

    /**
     * Executes regular physical attack.
     */
    @Transactional
    public TurnResult executePlayerAttack(Long telegramId) {
        Player player = getPlayer(telegramId);
        BattleSession session = getSession(telegramId);

        if (session.isFinished()) {
            return buildFinishedResult(session);
        }

        StringBuilder logBuilder = new StringBuilder();
        logBuilder.append("<b>[Раунд ").append(session.getRound()).append("]</b>\n");

        // 1. Player attack roll
        double evasionChance = GameBalanceConfig.calculateEvasionRate(session.getMonsterAgility(), player.getAgility());
        boolean monsterEvaded = random.nextDouble() < evasionChance;

        if (monsterEvaded) {
            logBuilder.append("💨 <b>").append(monsterName(session)).append("</b> молниеносно уклоняется от вашего удара!\n");
        } else {
            double critChance = GameBalanceConfig.calculateCritRate(player.getAgility(), player.getIntelligence());
            boolean isCrit = random.nextDouble() < critChance;
            int damage = GameBalanceConfig.calculateDamage(player.getAttack(), session.getMonsterDefense(), 1.0, isCrit);

            session.setMonsterHp(Math.max(0, session.getMonsterHp() - damage));

            if (isCrit) {
                logBuilder.append("💥 <b>КРИТИЧЕСКИЙ УДАР!</b> Вы наносите <b>").append(damage).append("</b> урона по телу монстра!\n");
            } else {
                logBuilder.append("🗡️ Вы атакуете врага и наносите <b>").append(damage).append("</b> физ. урона.\n");
            }
        }

        // Check if monster died
        if (session.getMonsterHp() <= 0) {
            return handleVictory(player, session, logBuilder);
        }

        // 2. Monster Counter-attack
        executeMonsterTurn(player, session, logBuilder);

        // Check if player died
        if (player.getHp() <= 0) {
            return handleDefeat(player, session, logBuilder);
        }

        // Advance round
        session.setRound(session.getRound() + 1);
        session.setCombatLog(logBuilder.toString());
        session.setUpdatedAt(LocalDateTime.now());
        battleSessionRepository.save(session);
        playerRepository.save(player);

        TurnResult result = new TurnResult();
        result.session = session;
        result.battleEnded = false;
        result.actionLog = logBuilder.toString();
        return result;
    }

    /**
     * Executes a skill cast by player.
     */
    @Transactional
    public TurnResult executePlayerSkill(Long telegramId, Long skillId) {
        Player player = getPlayer(telegramId);
        BattleSession session = getSession(telegramId);

        if (session.isFinished()) {
            return buildFinishedResult(session);
        }

        Optional<PlayerSkill> playerSkillOpt = playerSkillRepository.findById(skillId);
        if (playerSkillOpt.isEmpty()) {
            // Fallback to basic attack if skill not found
            return executePlayerAttack(telegramId);
        }

        PlayerSkill skill = playerSkillOpt.get();
        StringBuilder logBuilder = new StringBuilder();
        logBuilder.append("<b>[Раунд ").append(session.getRound()).append("]</b>\n");

        if (player.getMp() < skill.getMpCost()) {
            logBuilder.append("⚠️ <i>«Великий Мудрец»: Недостаточно магикул для активации [")
                    .append(skill.getSkillName()).append("]! (Требуется: ").append(skill.getMpCost())
                    .append(" MP). Вынужденная базовая атака!</i>\n");
            return executePlayerAttack(telegramId);
        }

        // Consume MP
        player.consumeMp(skill.getMpCost());
        skill.addMasteryExp(1);
        playerSkillRepository.save(skill);

        // Process effect
        switch (skill.getEffectType().toUpperCase()) {
            case "DAMAGE" -> {
                double critChance = GameBalanceConfig.calculateCritRate(player.getAgility(), player.getIntelligence());
                boolean isCrit = random.nextDouble() < (critChance + 0.10);
                int damage = GameBalanceConfig.calculateDamage(player.getAttack() + player.getIntelligence(),
                        session.getMonsterDefense(), skill.getPowerMultiplier(), isCrit);

                session.setMonsterHp(Math.max(0, session.getMonsterHp() - damage));

                logBuilder.append("🔥 <b>[Навык: ").append(skill.getSkillName()).append("]!</b>\n")
                        .append("Вы обрушиваете сокрушительную магию! Нанесено: <b>").append(damage).append("</b> урона!\n");
            }
            case "SHIELD" -> {
                int shieldAmount = (int) Math.round(player.getIntelligence() * 2.5 * skill.getPowerMultiplier());
                session.setBarrierShield(session.getBarrierShield() + shieldAmount);
                logBuilder.append("🛡️ <b>[Навык: ").append(skill.getSkillName()).append("]!</b>\n")
                        .append("Вокруг вас разворачивается магический барьер прочностью <b>").append(shieldAmount).append("</b> ед. урона!\n");
            }
            case "HEAL" -> {
                int healAmount = (int) Math.round(player.getIntelligence() * 2.0 * skill.getPowerMultiplier());
                player.heal(healAmount);
                logBuilder.append("💚 <b>[Навык: ").append(skill.getSkillName()).append("]!</b>\n")
                        .append("Сверхбыстрая регенерация восстанавливает <b>+").append(healAmount).append("</b> HP!\n");
            }
            default -> {
                int damage = GameBalanceConfig.calculateDamage(player.getAttack(), session.getMonsterDefense(), skill.getPowerMultiplier(), false);
                session.setMonsterHp(Math.max(0, session.getMonsterHp() - damage));
                logBuilder.append("⚡ Вы применяете <b>").append(skill.getSkillName()).append("</b> и наносите <b>").append(damage).append("</b> урона!\n");
            }
        }

        // Check if monster died
        if (session.getMonsterHp() <= 0) {
            return handleVictory(player, session, logBuilder);
        }

        // Monster Counter-attack
        executeMonsterTurn(player, session, logBuilder);

        // Check if player died
        if (player.getHp() <= 0) {
            return handleDefeat(player, session, logBuilder);
        }

        session.setRound(session.getRound() + 1);
        session.setCombatLog(logBuilder.toString());
        session.setUpdatedAt(LocalDateTime.now());
        battleSessionRepository.save(session);
        playerRepository.save(player);

        TurnResult result = new TurnResult();
        result.session = session;
        result.battleEnded = false;
        result.actionLog = logBuilder.toString();
        return result;
    }

    /**
     * Uses Healing Potion in battle.
     */
    @Transactional
    public TurnResult executeUsePotion(Long telegramId) {
        Player player = getPlayer(telegramId);
        BattleSession session = getSession(telegramId);

        if (session.isFinished()) {
            return buildFinishedResult(session);
        }

        StringBuilder logBuilder = new StringBuilder();
        logBuilder.append("<b>[Раунд ").append(session.getRound()).append("]</b>\n");

        Optional<Item> potionOpt = itemRepository.findByPlayerTelegramId(telegramId).stream()
                .filter(i -> i.isConsumable() && i.getName().contains("Зелье") && i.getQuantity() > 0)
                .findFirst();

        if (potionOpt.isEmpty()) {
            logBuilder.append("❌ В инвентаре нет доступных Лечебных Зелий Джуры!\n");
        } else {
            Item potion = potionOpt.get();
            int healHp = 120 + (potion.getHpBonus() > 0 ? potion.getHpBonus() : 50);
            int healMp = 80 + potion.getMpBonus();
            player.heal(healHp);
            player.restoreMp(healMp);

            potion.setQuantity(potion.getQuantity() - 1);
            if (potion.getQuantity() <= 0) {
                itemRepository.delete(potion);
            } else {
                itemRepository.save(potion);
            }

            logBuilder.append("🧪 Вы выпиваете <b>").append(potion.getName()).append("</b>!\n")
                    .append("Восстановлено: <b>+").append(healHp).append(" HP</b> и <b>+").append(healMp).append(" MP</b>!\n");
        }

        // Monster hits player
        executeMonsterTurn(player, session, logBuilder);

        if (player.getHp() <= 0) {
            return handleDefeat(player, session, logBuilder);
        }

        session.setRound(session.getRound() + 1);
        session.setCombatLog(logBuilder.toString());
        session.setUpdatedAt(LocalDateTime.now());
        battleSessionRepository.save(session);
        playerRepository.save(player);

        TurnResult result = new TurnResult();
        result.session = session;
        result.battleEnded = false;
        result.actionLog = logBuilder.toString();
        return result;
    }

    /**
     * Executes Predator devour directly in battle if monster HP < 30% or defeated.
     */
    @Transactional
    public TurnResult executeBattleDevour(Long telegramId) {
        Player player = getPlayer(telegramId);
        BattleSession session = getSession(telegramId);

        StringBuilder logBuilder = new StringBuilder();
        logBuilder.append("<b>[Раунд ").append(session.getRound()).append("]</b>\n");

        double hpRatio = (double) session.getMonsterHp() / Math.max(1, session.getMonsterMaxHp());
        if (hpRatio > 0.35 && session.getMonsterHp() > 0) {
            logBuilder.append("❌ <i>«Великий Мудрец»: Плотность жизненных сил цели слишком высока (")
                    .append(String.format("%.0f", hpRatio * 100))
                    .append("%). Поглощение невозможно, пока цель не ослаблена до 35% HP!</i>\n");

            executeMonsterTurn(player, session, logBuilder);
            if (player.getHp() <= 0) return handleDefeat(player, session, logBuilder);

            session.setRound(session.getRound() + 1);
            session.setCombatLog(logBuilder.toString());
            battleSessionRepository.save(session);
            playerRepository.save(player);

            TurnResult r = new TurnResult();
            r.session = session;
            r.battleEnded = false;
            r.actionLog = logBuilder.toString();
            return r;
        }

        // Successfully devour weakened or dying monster!
        logBuilder.append("🌀 <b>ВЫ АКТИВИРУЕТЕ «ХИЩНИК» (PREDATOR)!</b>\n")
                .append("Гигантская темная пасть слизи окутывает противника и поглощает его целиком!\n\n");

        session.setMonsterHp(0);
        return handleVictory(player, session, logBuilder, true);
    }

    /**
     * Attempt to flee battle.
     */
    @Transactional
    public TurnResult executeFlee(Long telegramId) {
        Player player = getPlayer(telegramId);
        BattleSession session = getSession(telegramId);

        StringBuilder logBuilder = new StringBuilder();
        double fleeChance = 0.50 + ((player.getAgility() - session.getMonsterAgility()) * 0.015);
        fleeChance = Math.max(0.20, Math.min(0.90, fleeChance));

        if (session.getBattleType().equals("RAID") || session.getMonsterRank().equalsIgnoreCase("CATASTROPHE")) {
            logBuilder.append("⛔ <b>Бегство невозможно!</b> Пространство искажено аурой Бедствия!\n");
            executeMonsterTurn(player, session, logBuilder);
        } else if (random.nextDouble() < fleeChance) {
            logBuilder.append("💨 <b>Вы успешно растворились в тени леса и избежали гибели!</b>\n");
            session.setFinished(true);
            session.setPlayerWon(false);
            player.setInBattle(false);
            playerRepository.save(player);
            battleSessionRepository.save(session);

            TurnResult res = new TurnResult();
            res.session = session;
            res.battleEnded = true;
            res.playerWon = false;
            res.actionLog = logBuilder.toString();
            return res;
        } else {
            logBuilder.append("❌ <b>Попытка побега провалилась!</b> Монстр блокирует путь отхода!\n");
            executeMonsterTurn(player, session, logBuilder);
        }

        if (player.getHp() <= 0) {
            return handleDefeat(player, session, logBuilder);
        }

        session.setRound(session.getRound() + 1);
        session.setCombatLog(logBuilder.toString());
        session.setUpdatedAt(LocalDateTime.now());
        battleSessionRepository.save(session);
        playerRepository.save(player);

        TurnResult res = new TurnResult();
        res.session = session;
        res.battleEnded = false;
        res.actionLog = logBuilder.toString();
        return res;
    }

    private void executeMonsterTurn(Player player, BattleSession session, StringBuilder logBuilder) {
        double playerEvasion = GameBalanceConfig.calculateEvasionRate(player.getAgility(), session.getMonsterAgility());
        if (random.nextDouble() < playerEvasion) {
            logBuilder.append("✨ Вы мгновенно растекаетесь слизью, полностью уклонившись от встречной атаки!\n");
            return;
        }

        double critChance = 0.06 + (session.getMonsterAgility() * 0.001);
        boolean isCrit = random.nextDouble() < critChance;
        int rawDmg = GameBalanceConfig.calculateDamage(session.getMonsterAttack(), player.getDefense(), 1.0, isCrit);

        // Check active barrier shield
        if (session.getBarrierShield() > 0) {
            if (session.getBarrierShield() >= rawDmg) {
                session.setBarrierShield(session.getBarrierShield() - rawDmg);
                logBuilder.append("🛡️ «Барьер искажения» поглотил все <b>").append(rawDmg).append("</b> ед. урона! (Остаток барьера: ")
                        .append(session.getBarrierShield()).append(")\n");
                return;
            } else {
                int mitigated = session.getBarrierShield();
                rawDmg -= mitigated;
                session.setBarrierShield(0);
                logBuilder.append("💥 «Барьер искажения» разрушен, поглотив ").append(mitigated).append(" урона!\n");
            }
        }

        player.takeDamage(rawDmg);
        if (isCrit) {
            logBuilder.append("⚠️ <b>ВРАЖЕСКИЙ КРИТИЧЕСКИЙ УДАР!</b> ").append(monsterName(session))
                    .append(" пробивает вашу броню на <b>").append(rawDmg).append("</b> HP!\n");
        } else {
            logBuilder.append("💥 ").append(monsterName(session)).append(" контратакует и наносит <b>")
                    .append(rawDmg).append("</b> урона.\n");
        }
    }

    private TurnResult handleVictory(Player player, BattleSession session, StringBuilder logBuilder) {
        return handleVictory(player, session, logBuilder, false);
    }

    private TurnResult handleVictory(Player player, BattleSession session, StringBuilder logBuilder, boolean devouring) {
        session.setFinished(true);
        session.setPlayerWon(true);
        player.setInBattle(false);

        // Give EXP & Stellas
        long exp = session.getExpReward();
        long stellas = session.getStellasReward();
        player.gainExp(exp);
        player.setStellas(player.getStellas() + stellas);

        logBuilder.append("\n🏆 <b>ПОБЕДА В СРАЖЕНИИ!</b>\n")
                .append("• Получено опыта: <b>+").append(exp).append(" EXP</b>\n")
                .append("• Награда: <b>+").append(stellas).append(" Стелл</b>\n");

        // If in Labyrinth, update floor
        if (session.getBattleType().equals("LABYRINTH")) {
            int cur = session.getLabyrinthFloor();
            player.setCurrentLabyrinthFloor(cur + 1);
            if (cur + 1 > player.getHighestLabyrinthFloor()) {
                player.setHighestLabyrinthFloor(cur + 1);
            }
            logBuilder.append("🚪 <i>Путь на этаж [").append(cur + 1).append("] открыт!</i>\n");
        }

        // Automatic Predator devour trigger
        Monster snapshot = Monster.builder()
                .name(session.getMonsterName())
                .species(session.getMonsterSpecies())
                .rank(session.getMonsterRank())
                .maxHp(session.getMonsterMaxHp())
                .mp(session.getMonsterMaxHp() * 2)
                .attack(session.getMonsterAttack())
                .defense(session.getMonsterDefense())
                .extractableSkillName(session.getExtractableSkill())
                .droppedItemName(session.getDropItemName())
                .dropRate(session.getDropRate())
                .build();

        PredatorService.DevourResult devourRes = predatorService.devourMonster(player, snapshot);
        logBuilder.append("\n").append(devourRes.formattedReport);

        session.setCombatLog(logBuilder.toString());
        session.setUpdatedAt(LocalDateTime.now());
        battleSessionRepository.save(session);
        playerRepository.save(player);

        TurnResult result = new TurnResult();
        result.session = session;
        result.battleEnded = true;
        result.playerWon = true;
        result.actionLog = logBuilder.toString();
        result.devourResult = devourRes;
        return result;
    }

    private TurnResult handleDefeat(Player player, BattleSession session, StringBuilder logBuilder) {
        session.setFinished(true);
        session.setPlayerWon(false);
        player.setInBattle(false);

        // Resurrect with 20% HP in Tempest Clinic
        player.setHp((int) Math.max(10, player.getMaxHp() * 0.20));
        player.setMp((int) Math.max(20, player.getMaxMp() * 0.20));

        logBuilder.append("\n💀 <b>ПОРАЖЕНИЕ...</b>\n")
                .append("Ваша физическая форма слизи разрушена мощным ударом!\n")
                .append("<i>«Великий Мудрец»: «Аварийный протокол. Ядро сущности эвакуировано в Лабораторию Темпеста. Жизненные показатели стабилизированы.»</i>\n");

        session.setCombatLog(logBuilder.toString());
        session.setUpdatedAt(LocalDateTime.now());
        battleSessionRepository.save(session);
        playerRepository.save(player);

        TurnResult result = new TurnResult();
        result.session = session;
        result.battleEnded = true;
        result.playerWon = false;
        result.actionLog = logBuilder.toString();
        return result;
    }

    private TurnResult buildFinishedResult(BattleSession session) {
        TurnResult r = new TurnResult();
        r.session = session;
        r.battleEnded = true;
        r.playerWon = session.isPlayerWon();
        r.actionLog = session.getCombatLog();
        return r;
    }

    private Player getPlayer(Long telegramId) {
        return playerRepository.findByTelegramId(telegramId)
                .orElseThrow(() -> new IllegalStateException("Игрок не найден: " + telegramId));
    }

    private BattleSession getSession(Long telegramId) {
        return battleSessionRepository.findByPlayerTelegramId(telegramId)
                .orElseThrow(() -> new IllegalStateException("Боевая сессия не найдена для: " + telegramId));
    }

    private String monsterName(BattleSession s) {
        return s.getMonsterName();
    }
}
