package com.tensura.ui;

import com.tensura.entity.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MessageFormatter {

    /**
     * Builds an aesthetic unicode progress bar, e.g. [▰▰▰▰▰▱▱▱▱▱]
     */
    public static String renderProgressBar(long current, long max, int length) {
        if (max <= 0) return "▱".repeat(Math.max(1, length));
        double fraction = Math.max(0.0, Math.min(1.0, (double) current / max));
        int filled = (int) Math.round(fraction * length);
        int empty = length - filled;
        return "▰".repeat(Math.max(0, filled)) + "▱".repeat(Math.max(0, empty));
    }

    /**
     * Stood-out Player Profile card.
     */
    public String formatProfile(Player player, List<Item> equippedItems, int subordinatesCount) {
        String hpBar = renderProgressBar(player.getHp(), player.getMaxHp(), 10);
        String mpBar = renderProgressBar(player.getMp(), player.getMaxMp(), 10);
        String expBar = renderProgressBar(player.getExp(), player.getMaxExp(), 10);
        String stmBar = renderProgressBar(player.getStamina(), player.getMaxStamina(), 8);

        StringBuilder sb = new StringBuilder();
        sb.append("╔═══════════════════════════╗\n");
        sb.append("   👑 <b>ПАСПОРТ СУЩНОСТИ ТЕМПЕСТА</b>\n");
        sb.append("╚═══════════════════════════╝\n\n");

        sb.append("👤 <b>Имя:</b> ").append(player.getNickname()).append(" (@").append(player.getUsername()).append(")\n");
        sb.append("🧬 <b>Раса:</b> ").append(player.getRace()).append("\n");
        sb.append("🎖️ <b>Ранг опасности:</b> ").append(player.getRank()).append("\n");
        sb.append("🏷️ <b>Титул:</b> <i>«").append(player.getActiveTitle()).append("»</i>\n");
        sb.append("⚡ <b>Уровень:</b> <b>").append(player.getLevel()).append("</b>\n\n");

        sb.append("❤️ <b>HP:</b> ").append(player.getHp()).append(" / ").append(player.getMaxHp())
                .append("  [").append(hpBar).append("]\n");
        sb.append("🔮 <b>Магикулы (MP):</b> ").append(player.getMp()).append(" / ").append(player.getMaxMp())
                .append("  [").append(mpBar).append("]\n");
        sb.append("⭐ <b>Опыт (EXP):</b> ").append(player.getExp()).append(" / ").append(player.getMaxExp())
                .append("  [").append(expBar).append("]\n");
        sb.append("🔋 <b>Выносливость:</b> ").append(player.getStamina()).append(" / ").append(player.getMaxStamina())
                .append("  [").append(stmBar).append("]\n\n");

        sb.append("⚔️ <b>ХАРАКТЕРИСТИКИ:</b>\n");
        sb.append("• 🗡️ Сила атаки: <b>").append(player.getAttack()).append("</b>\n");
        sb.append("• 🛡️ Защита: <b>").append(player.getDefense()).append("</b>\n");
        sb.append("• 💨 Ловкость / Скорость: <b>").append(player.getAgility()).append("</b>\n");
        sb.append("• 🧠 Интеллект / Магия: <b>").append(player.getIntelligence()).append("</b>\n\n");

        sb.append("💰 <b>КАЗНА И РЕСУРСЫ:</b>\n");
        sb.append("• 🪙 Стеллы: <b>").append(String.format("%,d", player.getStellas())).append("</b>\n");
        sb.append("• 💎 Магические кристаллы: <b>").append(player.getMagicCrystals()).append("</b>\n");
        sb.append("• 👻 Поглощенные души (Лорд Демонов): <b>").append(player.getCollectedSouls()).append("</b>\n\n");

        sb.append("🏰 <b>ПРОГРЕСС И СВЯЗИ:</b>\n");
        sb.append("• 🌀 Лабиринт Рамирис: <b>").append(player.getCurrentLabyrinthFloor()).append("-й этаж</b> (Рекорд: ")
                .append(player.getHighestLabyrinthFloor()).append(")\n");
        sb.append("• 👥 Нареченные соратники: <b>").append(subordinatesCount).append("</b> монстров\n\n");

        if (equippedItems != null && !equippedItems.isEmpty()) {
            sb.append("🥋 <b>ЭКИПИРОВКА:</b>\n");
            for (Item item : equippedItems) {
                sb.append("• [").append(item.getItemType()).append("] <b>").append(item.getName())
                        .append("</b> (+ATK ").append(item.getAttackBonus()).append(", +DEF ")
                        .append(item.getDefenseBonus()).append(")\n");
            }
        }

        return sb.toString();
    }

    /**
     * Stood-out Tempest City overview card.
     */
    public String formatCity(BunkerCity city, long playerStellas) {
        StringBuilder sb = new StringBuilder();
        sb.append("╔═══════════════════════════╗\n");
        sb.append("   🏰 <b>ФЕДЕРАЦИЯ ДЖУРА ТЕМПЕСТ</b>\n");
        sb.append("╚═══════════════════════════╝\n\n");

        sb.append("📍 <b>Статус столицы:</b> <b>").append(city.getCityName()).append("</b>\n");
        sb.append("🏘️ <b>Уровень города:</b> ").append(city.getCityLevel()).append(" (Население: ")
                .append(city.getPopulation()).append(" монстров)\n");
        sb.append("👷 <b>Рабочая сила:</b> ").append(city.getAssignedWorkers()).append(" мастеров на объектах\n\n");

        sb.append("🏛️ <b>ИНФРАСТРУКТУРА И ОБЪЕКТЫ:</b>\n");
        sb.append("• ⚒️ <b>Кузница Куробе:</b> Уровень <b>").append(city.getBlacksmithLevel()).append("</b> (Крафт редкой экипировки)\n");
        sb.append("• 🧪 <b>Лаборатория Бальмунда:</b> Уровень <b>").append(city.getLabLevel()).append("</b> (Варка зелий полного исцеления)\n");
        sb.append("• 🍻 <b>Трактир Ригурда:</b> Уровень <b>").append(city.getTavernLevel()).append("</b> (Казино, кости и рулетка)\n");
        sb.append("• 🌾 <b>Фермы гоблинов:</b> Уровень <b>").append(city.getFarmLevel()).append("</b> (Прирост пищи и населения)\n");
        sb.append("• 🛡️ <b>Барьер Джуры:</b> Уровень <b>").append(city.getBarrierLevel()).append("</b> (Защита границ от вражеских волн)\n\n");

        sb.append("📦 <b>СКЛАДСКИЕ ЗАПАСЫ:</b>\n");
        sb.append("• ⛏️ Магическая руда: <b>").append(city.getMagicOre()).append("</b> шт.\n");
        sb.append("• 🪵 Древесина Джуры: <b>").append(city.getJuraTimber()).append("</b> шт.\n");
        sb.append("• 💧 Магическая вода Вельдоры: <b>").append(city.getMagicWater()).append("</b> колб\n");
        sb.append("• 🧪 Зелья полного исцеления: <b>").append(city.getHealingPotions()).append("</b> шт.\n");
        sb.append("• 🪙 Накопленный налог: <b>").append(city.getUncollectedStellas()).append("</b> Стелл\n\n");

        sb.append("<i>«Великий Мудрец»: Город работает штатно. Доступно улучшение объектов и сбор ресурсов.</i>");
        return sb.toString();
    }

    /**
     * Stood-out Battle Screen card.
     */
    public String formatBattleScreen(BattleSession session, Player player) {
        String monsterHpBar = renderProgressBar(session.getMonsterHp(), session.getMonsterMaxHp(), 10);
        String playerHpBar = renderProgressBar(player.getHp(), player.getMaxHp(), 10);
        String playerMpBar = renderProgressBar(player.getMp(), player.getMaxMp(), 10);

        StringBuilder sb = new StringBuilder();
        sb.append("╔═══════════════════════════╗\n");
        sb.append("    ⚔️ <b>БОЕВОЕ СТОЛКНОВЕНИЕ</b> [Раунд ").append(session.getRound()).append("]\n");
        sb.append("╚═══════════════════════════╝\n\n");

        sb.append("👾 <b>ПРОТИВНИК:</b> <b>").append(session.getMonsterName()).append("</b>\n");
        sb.append("🎖️ <b>Ранг:</b> ").append(session.getMonsterRank()).append(" (").append(session.getMonsterSpecies()).append(")\n");
        sb.append("🩸 <b>HP врага:</b> ").append(session.getMonsterHp()).append(" / ").append(session.getMonsterMaxHp())
                .append("  [").append(monsterHpBar).append("]\n\n");

        sb.append("══════════ VS ══════════\n\n");

        sb.append("🔵 <b>ВЫ (").append(player.getRace()).append("):</b>\n");
        sb.append("❤️ <b>HP:</b> ").append(player.getHp()).append(" / ").append(player.getMaxHp())
                .append("  [").append(playerHpBar).append("]\n");
        sb.append("🔮 <b>MP (Магикулы):</b> ").append(player.getMp()).append(" / ").append(player.getMaxMp())
                .append("  [").append(playerMpBar).append("]\n");

        if (session.getBarrierShield() > 0) {
            sb.append("🛡️ <b>Барьер искажения:</b> <code>").append(session.getBarrierShield()).append(" ед.</code>\n");
        }

        sb.append("\n📜 <b>ХРОНИКА СРАЖЕНИЯ:</b>\n");
        if (session.getCombatLog() != null && !session.getCombatLog().isEmpty()) {
            sb.append(session.getCombatLog()).append("\n");
        }

        return sb.toString();
    }

    /**
     * Format Subordinates Baracks.
     */
    public String formatSubordinatesList(List<Subordinate> subordinates) {
        StringBuilder sb = new StringBuilder();
        sb.append("╔═══════════════════════════╗\n");
        sb.append("   👥 <b>КОРПУС ПОДЧИНЕННЫХ МОНСТРОВ</b>\n");
        sb.append("╚═══════════════════════════╝\n\n");

        if (subordinates.isEmpty()) {
            sb.append("У вас пока нет нареченных соратников.\n")
                    .append("<i>Откройте меню Наречения Именем, чтобы даровать сущность монстрам Джуры!</i>\n");
            return sb.toString();
        }

        sb.append("Ваши верные командиры и воины Темпеста:\n\n");
        for (int i = 0; i < subordinates.size(); i++) {
            Subordinate s = subordinates.get(i);
            sb.append(i + 1).append(". <b>").append(s.getCustomName()).append("</b> [").append(s.getEvolvedSpecies()).append("]\n");
            sb.append("   • Ранг: <b>").append(s.getRank()).append("</b> | Мощь: <b>").append(s.getCombatPower()).append("</b>\n");
            sb.append("   • Преданность: <b>").append(s.getLoyalty()).append("%</b> | Назначение: <code>").append(s.getAssignedDuty()).append("</code>\n\n");
        }

        sb.append("<i>«Великий Мудрец»: Связь через Коридор Душ стабильна. Все соратники готовы к выполнению приказов.</i>");
        return sb.toString();
    }

    /**
     * Format Skills Grimoire.
     */
    public String formatSkillsGrimoire(List<PlayerSkill> skills) {
        StringBuilder sb = new StringBuilder();
        sb.append("╔═══════════════════════════╗\n");
        sb.append("   📖 <b>ГРИМУАР НАВЫКОВ И МАГИИ</b>\n");
        sb.append("╚═══════════════════════════╝\n\n");

        if (skills.isEmpty()) {
            sb.append("В вашем арсенале нет активных умений.\n");
            return sb.toString();
        }

        for (PlayerSkill s : skills) {
            String star = s.getSkillType().equals("ULTIMATE") ? "👑" : s.getSkillType().equals("UNIQUE") ? "🌟" : "🔹";
            sb.append(star).append(" <b>").append(s.getSkillName()).append("</b> (").append(s.getJapaneseName()).append(")\n");
            sb.append("   • Тип: <code>").append(s.getSkillType()).append("</code> | Мастерство: Ур. <b>").append(s.getMasteryLevel()).append("</b>\n");
            sb.append("   • Расход магикул: <b>").append(s.getMpCost()).append(" MP</b> | Множитель: <b>x").append(String.format("%.2f", s.getPowerMultiplier())).append("</b>\n");
            sb.append("   • Эффект: <i>").append(s.getDescription()).append("</i>\n\n");
        }

        return sb.toString();
    }

    /**
     * Format Inventory backpack.
     */
    public String formatInventory(List<Item> items) {
        StringBuilder sb = new StringBuilder();
        sb.append("╔═══════════════════════════╗\n");
        sb.append("   🎒 <b>ПРОСТРАНСТВЕННОЕ ХРАНИЛИЩЕ («ЖЕЛУДОК»)</b>\n");
        sb.append("╚═══════════════════════════╝\n\n");

        if (items.isEmpty()) {
            sb.append("Ваше хранилище пусто.\n")
                    .append("<i>Используйте «Хищник» в бою или исследуйте Лабиринт Рамирис для сбора трофеев!</i>\n");
            return sb.toString();
        }

        for (Item item : items) {
            sb.append("• <b>").append(item.getName()).append("</b> [").append(item.getRarity()).append("] x<b>")
                    .append(item.getQuantity()).append("</b>\n");
            sb.append("   Тип: <code>").append(item.getItemType()).append("</code>");
            if (item.getAttackBonus() > 0) sb.append(" | +ATK: ").append(item.getAttackBonus());
            if (item.getDefenseBonus() > 0) sb.append(" | +DEF: ").append(item.getDefenseBonus());
            if (item.getHpBonus() > 0) sb.append(" | +HP: ").append(item.getHpBonus());
            sb.append("\n   <i>").append(item.getDescription()).append("</i>\n\n");
        }

        return sb.toString();
    }
}
