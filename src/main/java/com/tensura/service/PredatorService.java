package com.tensura.service;

import com.tensura.config.GameBalanceConfig;
import com.tensura.entity.*;
import com.tensura.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class PredatorService {

    private final PlayerRepository playerRepository;
    private final PlayerSkillRepository playerSkillRepository;
    private final SkillRepository skillRepository;
    private final ItemRepository itemRepository;
    private final CityRepository cityRepository;
    private final Random random = new Random();

    public static class DevourResult {
        public boolean skillLearned;
        public String learnedSkillName;
        public int gainedHp;
        public int gainedMp;
        public int gainedAtk;
        public int gainedDef;
        public int gainedSouls;
        public String gainedItemName;
        public String formattedReport;
    }

    /**
     * Executes the «Predator / Gluttony» skill to consume a defeated monster corpse.
     */
    @Transactional
    public DevourResult devourMonster(Player player, Monster monster) {
        log.info("Executing Predator skill for player [{}] on monster [{}]", player.getTelegramId(), monster.getName());

        DevourResult result = new DevourResult();

        // 1. Permanent Stat Assimilation
        int bonusHp = Math.max(1, (int) Math.round(monster.getMaxHp() * GameBalanceConfig.DEVOUR_STAT_BONUS_FRACTION));
        int bonusMp = Math.max(2, (int) Math.round(monster.getMp() * GameBalanceConfig.DEVOUR_STAT_BONUS_FRACTION * 1.5));
        int bonusAtk = Math.max(1, (int) Math.round(monster.getAttack() * GameBalanceConfig.DEVOUR_STAT_BONUS_FRACTION));
        int bonusDef = Math.max(1, (int) Math.round(monster.getDefense() * GameBalanceConfig.DEVOUR_STAT_BONUS_FRACTION));

        player.setMaxHp(player.getMaxHp() + bonusHp);
        player.setHp(Math.min(player.getMaxHp(), player.getHp() + bonusHp));
        player.setMaxMp(player.getMaxMp() + bonusMp);
        player.setMp(Math.min(player.getMaxMp(), player.getMp() + bonusMp));
        player.setAttack(player.getAttack() + bonusAtk);
        player.setDefense(player.getDefense() + bonusDef);

        result.gainedHp = bonusHp;
        result.gainedMp = bonusMp;
        result.gainedAtk = bonusAtk;
        result.gainedDef = bonusDef;

        // 2. Soul Harvest (Increases with monster rank)
        int soulsGained = calculateSoulsFromMonster(monster);
        player.setCollectedSouls(player.getCollectedSouls() + soulsGained);
        result.gainedSouls = soulsGained;

        // 3. Intrinsic / Unique Skill Extraction
        if (monster.getExtractableSkillName() != null && !monster.getExtractableSkillName().isEmpty()) {
            boolean alreadyHas = playerSkillRepository.existsByPlayerTelegramIdAndSkillName(
                    player.getTelegramId(), monster.getExtractableSkillName());

            if (!alreadyHas) {
                double chance = GameBalanceConfig.BASE_DEVOUR_SKILL_CHANCE + (player.getIntelligence() * 0.001);
                if (random.nextDouble() <= Math.min(0.85, chance)) {
                    // Extract and create player skill
                    Optional<Skill> templateOpt = skillRepository.findByName(monster.getExtractableSkillName());
                    Skill template = templateOpt.orElseGet(() -> createFallbackSkill(monster.getExtractableSkillName()));

                    PlayerSkill newSkill = PlayerSkill.builder()
                            .playerTelegramId(player.getTelegramId())
                            .skillName(template.getName())
                            .japaneseName(template.getJapaneseName())
                            .skillType(template.getSkillType())
                            .description(template.getDescription())
                            .mpCost(template.getMpCost())
                            .powerMultiplier(template.getPowerMultiplier())
                            .effectType(template.getEffectType())
                            .masteryLevel(1)
                            .masteryExp(0)
                            .equipped(true)
                            .acquiredAt(LocalDateTime.now())
                            .build();

                    playerSkillRepository.save(newSkill);
                    result.skillLearned = true;
                    result.learnedSkillName = template.getName();
                    log.info("Player [{}] learned new skill [{}] via Predator", player.getTelegramId(), template.getName());
                }
            }
        }

        // 4. Absorption into Stomach (Materials / Items)
        if (monster.getDroppedItemName() != null && random.nextDouble() <= monster.getDropRate()) {
            addItemToStomach(player.getTelegramId(), monster.getDroppedItemName());
            result.gainedItemName = monster.getDroppedItemName();
        }

        // Also add Magic Ore or Jura Timber directly to city storage
        cityRepository.findByPlayerTelegramId(player.getTelegramId()).ifPresent(city -> {
            city.setMagicOre(city.getMagicOre() + 15);
            city.setJuraTimber(city.getJuraTimber() + 25);
            cityRepository.save(city);
        });

        playerRepository.save(player);

        // 5. Format Great Sage Analysis Message
        result.formattedReport = buildSageDevourReport(monster, result);
        return result;
    }

    private void addItemToStomach(Long telegramId, String itemName) {
        Optional<Item> existing = itemRepository.findByNameAndPlayerTelegramId(itemName, telegramId);
        if (existing.isPresent()) {
            Item item = existing.get();
            item.setQuantity(item.getQuantity() + 1);
            itemRepository.save(item);
        } else {
            Optional<Item> catalogItem = itemRepository.findByNameAndPlayerTelegramIdIsNull(itemName);
            if (catalogItem.isPresent()) {
                Item newItem = catalogItem.get().createPlayerCopy(telegramId, 1);
                itemRepository.save(newItem);
            } else {
                // Create material drop
                Item newDrop = Item.builder()
                        .playerTelegramId(telegramId)
                        .name(itemName)
                        .itemType("MATERIAL")
                        .rarity("UNCOMMON")
                        .description("Органический или магический трофей, поглощенный «Хищником».")
                        .quantity(1)
                        .priceStellas(120L)
                        .priceCrystals(2L)
                        .build();
                itemRepository.save(newDrop);
            }
        }
    }

    private int calculateSoulsFromMonster(Monster monster) {
        return switch (monster.getRank().toUpperCase()) {
            case "C" -> 2;
            case "B" -> 5;
            case "A" -> 15;
            case "SPECIAL A" -> 45;
            case "DISASTER" -> 150;
            case "CALAMITY" -> 500;
            case "CATASTROPHE" -> 2500;
            default -> 1;
        };
    }

    private Skill createFallbackSkill(String skillName) {
        return Skill.builder()
                .name(skillName)
                .japaneseName("捕食獲得技")
                .skillType("COMBAT")
                .description("Навык, извлеченный и адаптированный из структуры сущности монстра.")
                .mpCost(40)
                .cooldownTurns(2)
                .powerMultiplier(1.8)
                .effectType("DAMAGE")
                .baseValue(70)
                .build();
    }

    private String buildSageDevourReport(Monster monster, DevourResult res) {
        StringBuilder sb = new StringBuilder();
        sb.append("🌀 <b>УНИКАЛЬНЫЙ НАВЫК: «ХИЩНИК» (PREDATOR)</b>\n");
        sb.append("<i>«Уведомление. Останки существа [").append(monster.getName()).append("] успешно изолированы в «Желудке» и разложены на первородную магическую материю.»</i>\n\n");

        sb.append("⚗️ <b>Результаты усвоения сущности:</b>\n");
        sb.append("• <b>Макс. HP:</b> +").append(res.gainedHp).append(" единиц\n");
        sb.append("• <b>Запас Магикул:</b> +").append(res.gainedMp).append(" MP\n");
        sb.append("• <b>Сила атаки:</b> +").append(res.gainedAtk).append("\n");
        sb.append("• <b>Защита тела:</b> +").append(res.gainedDef).append("\n");
        sb.append("• <b>Жатва Душ:</b> +").append(res.gainedSouls).append(" душ\n");

        if (res.skillLearned) {
            sb.append("\n🌟 <b>«ВЕЛИКИЙ МУДРЕЦ» СООБЩАЕТ:</b>\n");
            sb.append("<i>«Успех! Анализ магического контура завершен. Приобретен новый навык:</i> <code>")
                    .append(res.learnedSkillName).append("</code><i>!»</i>\n");
        }

        if (res.gainedItemName != null) {
            sb.append("📦 <b>Помещено в хранилище «Желудок»:</b> ").append(res.gainedItemName).append("\n");
        }

        sb.append("\n🌲 <i>Ресурсы (Руда +15, Древесина +25) направлены на склады Федерации Темпест.</i>");
        return sb.toString();
    }
}
