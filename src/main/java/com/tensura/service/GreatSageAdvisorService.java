package com.tensura.service;

import com.tensura.entity.Monster;
import com.tensura.entity.Player;
import com.tensura.entity.PlayerSkill;
import com.tensura.repository.PlayerSkillRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class GreatSageAdvisorService {

    private final PlayerSkillRepository playerSkillRepository;
    private final Random random = new Random();

    public String analyzeMonsterForBattle(Player player, Monster monster) {
        log.info("Great Sage analyzing monster [{}] for player [{}]", monster.getName(), player.getTelegramId());

        double playerPower = calculateCombatPower(player);
        double monsterPower = calculateMonsterCombatPower(monster);

        double winChance = calculateVictoryPercentage(playerPower, monsterPower, player.getHp(), player.getMaxHp(), player.getMp());

        StringBuilder report = new StringBuilder();
        report.append("🔮 <b>«ВЕЛИКИЙ МУДРЕЦ» — АНАЛИТИЧЕСКИЙ ОТЧЕТ</b>\n");
        report.append("<i>«Уведомление. Произведен спектральный анализ цели [").append(monster.getName()).append("].»</i>\n\n");

        report.append("🔹 <b>Ранг угрозы:</b> ").append(monster.getRank()).append("\n");
        report.append("🔹 <b>Вид:</b> ").append(monster.getSpecies()).append(" (Ур. ").append(monster.getLevel()).append(")\n");
        report.append("🔹 <b>Боевая мощь противника:</b> ").append(String.format("%,.0f", monsterPower)).append("\n");
        report.append("🔹 <b>Ваша боевая мощь:</b> ").append(String.format("%,.0f", playerPower)).append("\n\n");

        report.append("📊 <b>Расчетная вероятность победы:</b> <b>").append(String.format("%.1f", winChance)).append("%</b>\n\n");

        if (monster.getElementalWeakness() != null) {
            report.append("⚠️ <b>Уязвимость:</b> <code>").append(monster.getElementalWeakness()).append("</code> (Урон повышен на +50%)\n");
        }
        if (monster.getElementalResistance() != null) {
            report.append("🛡️ <b>Сопротивление:</b> <code>").append(monster.getElementalResistance()).append("</code> (Снижение урона на 40%)\n");
        }

        if (monster.getExtractableSkillName() != null) {
            report.append("🌀 <b>Потенциал «Хищника»:</b> При поглощении доступен навык <code>")
                    .append(monster.getExtractableSkillName()).append("</code>\n");
        }

        report.append("\n💡 <b>Тактические рекомендации Рафаэль:</b>\n");
        if (winChance >= 80.0) {
            report.append("• <i>«Противник значительно уступает в плотности магикул. Рекомендуется быстрая атака с последующим поглощением навыком «Хищник».»</i>");
        } else if (winChance >= 50.0) {
            report.append("• <i>«Силы сопоставимы. Рекомендуется активировать «Барьер искажения» на первых ходах и использовать направленные заклинания.»</i>");
        } else if (winChance >= 25.0) {
            report.append("• <i>«Внимание! Высокий риск критического урона. Рекомендуется запастись Лечебными зельями или вызвать союзника из отряда Темпеста.»</i>");
        } else {
            report.append("• <i>«КРИТИЧЕСКАЯ УГРОЗА! Шанс фатального исхода крайне велик. Совет: воздержитесь от лобового столкновения или используйте отступление.»</i>");
        }

        return report.toString();
    }

    public String analyzeCraftingRecipe(Player player, String recipeName, int forgeLevel, long ore, long timber) {
        log.info("Great Sage analyzing crafting recipe [{}] for player [{}]", recipeName, player.getTelegramId());

        StringBuilder sb = new StringBuilder();
        sb.append("🔬 <b>«ВЕЛИКИЙ МУДРЕЦ» — АНАЛИЗ СИНТЕЗА</b>\n");
        sb.append("<i>«Уведомление: Проверка алхимической совместимости и магических связей...»</i>\n\n");

        if (forgeLevel < 2 && recipeName.contains("Мифрил")) {
            sb.append("❌ <b>Отказ:</b> Уровень Кузницы Куробе недостаточен для кристаллизации мифриловой руды. Требуется кузница 2+ ранга.\n");
        } else if (ore < 50) {
            sb.append("⚠️ <b>Нехватка сырья:</b> Дефицит магической руды Джуры. Пополните запасы в шахтах или через экспедицию.\n");
        } else {
            double successRate = 85.0 + (forgeLevel * 3.5);
            sb.append("✅ <b>Синтез возможен:</b> Вероятность превосходного качества: <b>")
                    .append(Math.min(99.0, successRate)).append("%</b>\n");
            sb.append("• <i>«Рекомендация: Добавление магической воды из Пещеры Запечатывания усилит базовую прочность на +15%.»</i>\n");
        }

        return sb.toString();
    }

    public String getGeneralStatusAdvice(Player player) {
        StringBuilder advice = new StringBuilder();
        advice.append("🔮 <b>«ВЕЛИКИЙ МУДРЕЦ» — ДИАГНОСТИКА СУЩНОСТИ</b>\n");
        advice.append("<i>«Ответ. Анализ текущего состояния носителя:»</i>\n\n");

        double hpPercent = ((double) player.getHp() / player.getMaxHp()) * 100.0;
        double mpPercent = ((double) player.getMp() / player.getMaxMp()) * 100.0;

        if (hpPercent < 35.0) {
            advice.append("⚠️ <b>Критический запас жизненных сил (").append(String.format("%.0f", hpPercent)).append("%)!</b>\n")
                    .append("<i>«Активируйте «Сверхбыструю регенерацию» или примените Зелье полного восстановления.»</i>\n\n");
        }

        if (mpPercent < 20.0) {
            advice.append("⚠️ <b>Истощение магикул (").append(String.format("%.0f", mpPercent)).append("%)!</b>\n")
                    .append("<i>«Использование уникальных техник временно заблокировано во избежание магической комы.»</i>\n\n");
        }

        if (player.getLevel() >= 20 && player.getEvolutionStage() == 1) {
            advice.append("✨ <b>Готовность к Эволюции:</b>\n")
                    .append("<i>«Ваша плотность магикул достигла порога формы «Разумная Слизь». Откройте меню Эволюции для начала преобразования тела.»</i>\n\n");
        } else if (player.getLevel() >= 50 && player.getEvolutionStage() == 2) {
            advice.append("✨ <b>Предвестие Лорда Демонов:</b>\n")
                    .append("<i>«Накоплено душ: ").append(player.getCollectedSouls()).append(" / 1,000. Продолжайте рейды в Джунглях Джуры.»</i>\n\n");
        } else if (player.getLevel() >= 80 && player.getEvolutionStage() == 3) {
            advice.append("👑 <b>Праздник Урожая (Harvest Festival):</b>\n")
                    .append("<i>«Собрано душ: ").append(player.getCollectedSouls()).append(" / 10,000. По достижении нормы начнется Ритуал Пробуждения Истинного Лорда Демонов.»</i>\n\n");
        } else {
            advice.append("🛡️ <i>«Все жизненные показатели стабильны. Рекомендуется зачистка Лабиринта Рамирис для сбора ядер душ и прокачки мастерства навыков.»</i>\n");
        }

        return advice.toString();
    }

    public double calculateCombatPower(Player player) {
        return (player.getAttack() * 3.0) +
                (player.getDefense() * 2.2) +
                (player.getAgility() * 2.0) +
                (player.getIntelligence() * 2.8) +
                (player.getMaxHp() * 0.4) +
                (player.getMaxMp() * 0.2);
    }

    public double calculateMonsterCombatPower(Monster monster) {
        return (monster.getAttack() * 3.0) +
                (monster.getDefense() * 2.2) +
                (monster.getAgility() * 2.0) +
                (monster.getIntelligence() * 2.8) +
                (monster.getMaxHp() * 0.4) +
                (monster.getMp() * 0.2);
    }

    public double calculateVictoryPercentage(double playerPower, double monsterPower, int currentHp, int maxHp, int currentMp) {
        if (playerPower <= 0) return 1.0;
        double baseRatio = playerPower / (playerPower + monsterPower);

        double healthFactor = (double) currentHp / Math.max(1, maxHp);
        double magiculeFactor = Math.min(1.0, (double) currentMp / 200.0);

        double adjusted = baseRatio * (0.6 + (healthFactor * 0.3) + (magiculeFactor * 0.1));
        double percent = adjusted * 100.0;

        return Math.max(2.0, Math.min(98.5, percent));
    }
}
