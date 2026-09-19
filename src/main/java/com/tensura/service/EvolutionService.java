package com.tensura.service;

import com.tensura.config.GameBalanceConfig;
import com.tensura.entity.Player;
import com.tensura.entity.PlayerSkill;
import com.tensura.repository.PlayerRepository;
import com.tensura.repository.PlayerSkillRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EvolutionService {

    private final PlayerRepository playerRepository;
    private final PlayerSkillRepository playerSkillRepository;

    public static class EvolutionCheckResult {
        public boolean eligible;
        public String nextFormName;
        public String requirementsText;
        public String benefitsText;
    }

    public static class EvolutionExecutionResult {
        public boolean success;
        public String oldRace;
        public String newRace;
        public String newRank;
        public String storyNarrative;
    }

    public EvolutionCheckResult checkEvolutionEligibility(Player player) {
        EvolutionCheckResult res = new EvolutionCheckResult();

        switch (player.getEvolutionStage()) {
            case 1 -> { 
                res.nextFormName = "Разумная Слизь (Intelligent Slime)";
                boolean reqLvl = player.getLevel() >= GameBalanceConfig.EVOLUTION_INTELLIGENT_SLIME_LEVEL;
                boolean reqMp = player.getMaxMp() >= GameBalanceConfig.EVOLUTION_INTELLIGENT_SLIME_MP;
                boolean reqStellas = player.getStellas() >= GameBalanceConfig.EVOLUTION_INTELLIGENT_SLIME_STELLAS;
                res.eligible = reqLvl && reqMp && reqStellas;

                res.requirementsText = String.format(
                        "• Уровень: %d / %d %s\n• Запас магикул: %d / %d MP %s\n• Стеллы: %d / %d %s",
                        player.getLevel(), GameBalanceConfig.EVOLUTION_INTELLIGENT_SLIME_LEVEL, reqLvl ? "✅" : "❌",
                        player.getMaxMp(), GameBalanceConfig.EVOLUTION_INTELLIGENT_SLIME_MP, reqMp ? "✅" : "❌",
                        player.getStellas(), GameBalanceConfig.EVOLUTION_INTELLIGENT_SLIME_STELLAS, reqStellas ? "✅" : "❌"
                );
                res.benefitsText = "• Ранг повышается до C\n• Бонус характеристик: +40% к HP/MP/Атаке\n• Получение человекоподобной формы (Мимикрия)";
            }
            case 2 -> { 
                res.nextFormName = "Демоническая Слизь (Demon Slime)";
                boolean reqLvl = player.getLevel() >= GameBalanceConfig.EVOLUTION_DEMON_SLIME_LEVEL;
                boolean reqMp = player.getMaxMp() >= GameBalanceConfig.EVOLUTION_DEMON_SLIME_MP;
                boolean reqSouls = player.getCollectedSouls() >= GameBalanceConfig.EVOLUTION_DEMON_SLIME_SOULS;
                res.eligible = reqLvl && reqMp && reqSouls;

                res.requirementsText = String.format(
                        "• Уровень: %d / %d %s\n• Запас магикул: %d / %d MP %s\n• Собрано душ: %d / %d %s",
                        player.getLevel(), GameBalanceConfig.EVOLUTION_DEMON_SLIME_LEVEL, reqLvl ? "✅" : "❌",
                        player.getMaxMp(), GameBalanceConfig.EVOLUTION_DEMON_SLIME_MP, reqMp ? "✅" : "❌",
                        player.getCollectedSouls(), GameBalanceConfig.EVOLUTION_DEMON_SLIME_SOULS, reqSouls ? "✅" : "❌"
                );
                res.benefitsText = "• Ранг повышается до Special A (Бедствие)\n• Бонус характеристик: +70% ко всем атрибутам\n• Пробуждение способности «Хаотическое пожирание»";
            }
            case 3 -> { 
                res.nextFormName = "Истинный Лорд Демонов (True Demon Lord)";
                boolean reqLvl = player.getLevel() >= GameBalanceConfig.EVOLUTION_TRUE_DEMON_LORD_LEVEL;
                boolean reqMp = player.getMaxMp() >= GameBalanceConfig.EVOLUTION_TRUE_DEMON_LORD_MP;
                boolean reqSouls = player.getCollectedSouls() >= GameBalanceConfig.EVOLUTION_HARVEST_FESTIVAL_SOULS;
                res.eligible = reqLvl && reqMp && reqSouls;

                res.requirementsText = String.format(
                        "• Уровень: %d / %d %s\n• Запас магикул: %d / %d MP %s\n• Жертвы душ (Harvest Festival): %d / %d %s",
                        player.getLevel(), GameBalanceConfig.EVOLUTION_TRUE_DEMON_LORD_LEVEL, reqLvl ? "✅" : "❌",
                        player.getMaxMp(), GameBalanceConfig.EVOLUTION_TRUE_DEMON_LORD_MP, reqMp ? "✅" : "❌",
                        player.getCollectedSouls(), GameBalanceConfig.EVOLUTION_HARVEST_FESTIVAL_SOULS, reqSouls ? "✅" : "❌"
                );
                res.benefitsText = "• Ранг: S (Катастрофа / Владыка Демонов Октаграммы)\n• Бонус характеристик: +150% ко всем параметрам\n• Эволюция «Великого Мудреца» в «Владыку Мудрости Рафаэль»\n• Эволюция «Хищника» в «Повелителя Обжорства Вельзевул»";
            }
            default -> {
                res.eligible = false;
                res.nextFormName = "Пик Божественной Сущности Достигнут";
                res.requirementsText = "Вы достигли вершины эволюции мира Джуры.";
                res.benefitsText = "Титул: Владыка Хаоса и Творец Темпеста.";
            }
        }

        return res;
    }

    @Transactional
    public EvolutionExecutionResult performEvolution(Player player) {
        log.info("Attempting evolution for player [{}] stage [{}]", player.getTelegramId(), player.getEvolutionStage());

        EvolutionExecutionResult res = new EvolutionExecutionResult();
        res.oldRace = player.getRace();

        EvolutionCheckResult check = checkEvolutionEligibility(player);
        if (!check.eligible) {
            res.success = false;
            res.storyNarrative = "⚠️ <i>«Великий Мудрец»: «Отказ. Условия эволюции не соблюдены. Плотность магической материи недостаточна.»</i>\n\n"
                    + check.requirementsText;
            return res;
        }

        switch (player.getEvolutionStage()) {
            case 1 -> { 
                player.setRace("Разумная Слизь (Intelligent Slime)");
                player.setRank("C (Магический зверь)");
                player.setEvolutionStage(2);
                player.setActiveTitle("Хранитель Великого Леса Джура");

                player.setMaxHp((int) (player.getMaxHp() * 1.45));
                player.setMaxMp((int) (player.getMaxMp() * 1.50));
                player.setAttack((int) (player.getAttack() * 1.40));
                player.setDefense((int) (player.getDefense() * 1.40));
                player.setIntelligence((int) (player.getIntelligence() * 1.50));
                player.restoreFullHealth();

                player.setStellas(player.getStellas() - GameBalanceConfig.EVOLUTION_INTELLIGENT_SLIME_STELLAS);

                res.newRace = player.getRace();
                res.newRank = player.getRank();
                res.success = true;
                res.storyNarrative = buildStage1Narrative();
            }
            case 2 -> { 
                player.setRace("Демоническая Слизь (Demon Slime)");
                player.setRank("Special A (Бедствие Джуры)");
                player.setEvolutionStage(3);
                player.setActiveTitle("Повелитель Монстров Федерации");

                player.setMaxHp((int) (player.getMaxHp() * 1.70));
                player.setMaxMp((int) (player.getMaxMp() * 1.80));
                player.setAttack((int) (player.getAttack() * 1.65));
                player.setDefense((int) (player.getDefense() * 1.65));
                player.setIntelligence((int) (player.getIntelligence() * 1.75));
                player.restoreFullHealth();

                res.newRace = player.getRace();
                res.newRank = player.getRank();
                res.success = true;
                res.storyNarrative = buildStage2Narrative();
            }
            case 3 -> { 
                player.setRace("Истинный Лорд Демонов (True Demon Lord)");
                player.setRank("S (Катастрофа Октаграммы)");
                player.setEvolutionStage(4);
                player.setActiveTitle("Истинный Владыка Демонов Темпеста");

                player.setMaxHp((int) (player.getMaxHp() * 2.50));
                player.setMaxMp((int) (player.getMaxMp() * 2.60));
                player.setAttack((int) (player.getAttack() * 2.20));
                player.setDefense((int) (player.getDefense() * 2.20));
                player.setIntelligence((int) (player.getIntelligence() * 2.50));
                player.restoreFullHealth();

                evolveSkillsToUltimate(player.getTelegramId());

                res.newRace = player.getRace();
                res.newRank = player.getRank();
                res.success = true;
                res.storyNarrative = buildHarvestFestivalNarrative();
            }
            default -> {
                res.success = false;
                res.storyNarrative = "Вы уже достигли высшей ступени эволюции!";
                return res;
            }
        }

        playerRepository.save(player);
        return res;
    }

    private void evolveSkillsToUltimate(Long telegramId) {
        
        Optional<PlayerSkill> sageOpt = playerSkillRepository.findByPlayerTelegramIdAndSkillName(telegramId, "Великий Мудрец");
        if (sageOpt.isPresent()) {
            PlayerSkill sage = sageOpt.get();
            sage.setSkillName("Владыка Мудрости Рафаэль (Lord of Wisdom)");
            sage.setJapaneseName("智慧之王 (ラファエル)");
            sage.setSkillType("ULTIMATE");
            sage.setDescription("Высший навык совершенного анализа, вычисления вероятностей и параллельного управления процессами.");
            playerSkillRepository.save(sage);
        }

        Optional<PlayerSkill> predOpt = playerSkillRepository.findByPlayerTelegramIdAndSkillName(telegramId, "Хищник");
        if (predOpt.isPresent()) {
            PlayerSkill pred = predOpt.get();
            pred.setSkillName("Повелитель Обжорства Вельзевул (King of Gluttony)");
            pred.setJapaneseName("暴食之王 (ベルゼビュート)");
            pred.setSkillType("ULTIMATE");
            pred.setDescription("Высший навык всепожирающего распада, изоляции пространства и поглощения душ.");
            pred.setPowerMultiplier(3.8);
            playerSkillRepository.save(pred);
        }
    }

    private String buildStage1Narrative() {
        return """
                ✨ <b>РИТУАЛ ЭВОЛЮЦИИ ЗАВЕРШЕН!</b>
                
                <i>«Голос Мира: Подтверждение.
                Сущность низшей слизи реорганизована.
                Плотность магикул превзошла критический порог.
                Присвоен новый биологический вид: <b>Разумная Слизь</b>.»</i>
                
                В вашем теле пробудилось человеческое сознание и способность мимикрии.
                Атрибуты тела многократно усилены!
                """;
    }

    private String buildStage2Narrative() {
        return """
                🟣 <b>ТРАНСМУТАЦИЯ В ДЕМОНИЧЕСКУЮ СЛИЗЬ!</b>
                
                <i>«Голос Мира: Подтверждение.
                Накопление темной магической субстанции успешно завершено.
                Структура души приобрела инфернальный резонанс.
                Класс угрозы повышен до: <b>Special A (Бедствие)</b>.»</i>
                
                Вы источаете подавляющую ауру истинного монстра Джуры!
                """;
    }

    private String buildHarvestFestivalNarrative() {
        return """
                👑 <b>ПРАЗДНИК УРОЖАЯ: ПРОБУЖДЕНИЕ ИСТИННОГО ЛОРДА ДЕМОНОВ!</b>
                
                <i>«Голос Мира: Внимание всем сущностям этого измерения!
                Сбор 10,000 душ завершен.
                Начало Праздника Урожая (Harvest Festival).
                Генетическая цепь переписана.
                Рождение нового Истинного Владыки Демонов подтверждено!
                
                «Великий Мудрец» эволюционировал в Высший Навык: <b>«Владыка Мудрости: Рафаэль»</b>!
                «Хищник» эволюционировал в Высший Навык: <b>«Повелитель Обжорства: Вельзевул»</b>!»</i>
                
                Все подчиненные монстры Федерации Темпест получают Дар Лорда Демонов!
                """;
    }
}
