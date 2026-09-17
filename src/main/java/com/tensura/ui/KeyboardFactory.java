package com.tensura.ui;

import com.tensura.entity.Item;
import com.tensura.entity.PlayerSkill;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;

import java.util.ArrayList;
import java.util.List;

@Component
public class KeyboardFactory {

    public InlineKeyboardMarkup createMainMenu() {
        List<List<InlineKeyboardButton>> rows = new ArrayList<>();

        rows.add(List.of(
                btn("👤 Профиль Сущности", "NAV_PROFILE"),
                btn("🌲 Лес Джура (Охота)", "NAV_FOREST")
        ));

        rows.add(List.of(
                btn("🏰 Город Темпест", "NAV_CITY"),
                btn("🌀 Лабиринт Рамирис", "NAV_LABYRINTH")
        ));

        rows.add(List.of(
                btn("⚔️ Рейды на Бедствия", "NAV_RAIDS"),
                btn("🔮 Великий Мудрец", "NAV_SAGE")
        ));

        rows.add(List.of(
                btn("✨ Эволюция Расы", "NAV_EVOLUTION"),
                btn("👥 Именование Монстров", "NAV_NAMING")
        ));

        rows.add(List.of(
                btn("🎲 Трактир и Казино", "NAV_CASINO"),
                btn("🎒 Инвентарь («Желудок»)", "NAV_INVENTORY")
        ));

        rows.add(List.of(
                btn("🏆 Зал Славы (Топ)", "NAV_LEADERBOARD"),
                btn("🏪 Торговый Караван", "NAV_CARAVAN")
        ));

        InlineKeyboardMarkup markup = new InlineKeyboardMarkup();
        markup.setKeyboard(rows);
        return markup;
    }

    public InlineKeyboardMarkup createBattleKeyboard() {
        List<List<InlineKeyboardButton>> rows = new ArrayList<>();

        rows.add(List.of(
                btn("🗡️ Атаковать", "BATTLE_ATTACK"),
                btn("🔥 Выбрать Навык", "BATTLE_SKILL_MENU")
        ));

        rows.add(List.of(
                btn("🌀 Поглотить («Хищник»)", "BATTLE_DEVOUR"),
                btn("🧪 Лечебное Зелье", "BATTLE_POTION")
        ));

        rows.add(List.of(
                btn("🔮 Совет Мудреца", "BATTLE_SAGE_ADVICE"),
                btn("💨 Отступить", "BATTLE_FLEE")
        ));

        InlineKeyboardMarkup markup = new InlineKeyboardMarkup();
        markup.setKeyboard(rows);
        return markup;
    }

    public InlineKeyboardMarkup createBattleSkillSelectionKeyboard(List<PlayerSkill> skills) {
        List<List<InlineKeyboardButton>> rows = new ArrayList<>();

        for (PlayerSkill s : skills) {
            String text = String.format("%s (%d MP)", s.getSkillName(), s.getMpCost());
            rows.add(List.of(btn(text, "BATTLE_EXEC_SKILL_" + s.getId())));
        }

        rows.add(List.of(btn("🔙 Назад к бою", "BATTLE_RETURN_MENU")));

        InlineKeyboardMarkup markup = new InlineKeyboardMarkup();
        markup.setKeyboard(rows);
        return markup;
    }

    public InlineKeyboardMarkup createCityKeyboard() {
        List<List<InlineKeyboardButton>> rows = new ArrayList<>();

        rows.add(List.of(
                btn("🌾 Собрать урожай и налоги", "CITY_COLLECT"),
                btn("🏗️ Улучшить здания", "CITY_UPGRADE_MENU")
        ));

        rows.add(List.of(
                btn("⚒️ Кузница Куробе (Крафт)", "CITY_FORGE"),
                btn("🧪 Лаборатория Бальмунда (Зелья)", "CITY_LAB")
        ));

        rows.add(List.of(
                btn("🏟️ Колизей Темпеста (Арена)", "CITY_ARENA"),
                btn("🔙 В Главное Меню", "NAV_MAIN")
        ));

        InlineKeyboardMarkup markup = new InlineKeyboardMarkup();
        markup.setKeyboard(rows);
        return markup;
    }

    public InlineKeyboardMarkup createCityUpgradeMenu() {
        List<List<InlineKeyboardButton>> rows = new ArrayList<>();

        rows.add(List.of(
                btn("⚒️ Кузница (+Экипировка)", "UPGRADE_BLD_BLACKSMITH"),
                btn("🧪 Лаборатория (+Зелья)", "UPGRADE_BLD_LAB")
        ));

        rows.add(List.of(
                btn("🍻 Трактир (+Доход)", "UPGRADE_BLD_TAVERN"),
                btn("🌾 Фермы (+Население)", "UPGRADE_BLD_FARM")
        ));

        rows.add(List.of(
                btn("🛡️ Барьер Джуры (+Защита)", "UPGRADE_BLD_BARRIER"),
                btn("🔙 Назад в город", "NAV_CITY")
        ));

        InlineKeyboardMarkup markup = new InlineKeyboardMarkup();
        markup.setKeyboard(rows);
        return markup;
    }

    public InlineKeyboardMarkup createForgeRecipesKeyboard(List<Item> recipes) {
        List<List<InlineKeyboardButton>> rows = new ArrayList<>();

        for (Item r : recipes) {
            String label = String.format("%s (Руда: %d, Дерево: %d)", r.getName(), r.getRequiredOre(), r.getRequiredTimber());
            rows.add(List.of(btn(label, "FORGE_CRAFT_" + r.getName())));
        }

        rows.add(List.of(btn("🔙 Назад в Темпест", "NAV_CITY")));

        InlineKeyboardMarkup markup = new InlineKeyboardMarkup();
        markup.setKeyboard(rows);
        return markup;
    }

    public InlineKeyboardMarkup createLabyrinthKeyboard(int currentFloor) {
        List<List<InlineKeyboardButton>> rows = new ArrayList<>();

        rows.add(List.of(
                btn("🚪 Исследовать этаж " + currentFloor, "LAB_EXPLORE"),
                btn("🕊️ Покинуть Лабиринт", "NAV_MAIN")
        ));

        InlineKeyboardMarkup markup = new InlineKeyboardMarkup();
        markup.setKeyboard(rows);
        return markup;
    }

    public InlineKeyboardMarkup createRaidsKeyboard() {
        List<List<InlineKeyboardButton>> rows = new ArrayList<>();

        rows.add(List.of(
                btn("🔥 Ифрит (Special A)", "RAID_START_IFRIT"),
                btn("🍖 Орк-Дикарь Гельд (Disaster)", "RAID_START_GELD")
        ));

        rows.add(List.of(
                btn("🌊 Харибда (Calamity)", "RAID_START_CHARYBDIS"),
                btn("🔙 В Главное Меню", "NAV_MAIN")
        ));

        InlineKeyboardMarkup markup = new InlineKeyboardMarkup();
        markup.setKeyboard(rows);
        return markup;
    }

    public InlineKeyboardMarkup createEvolutionKeyboard(boolean eligible) {
        List<List<InlineKeyboardButton>> rows = new ArrayList<>();

        if (eligible) {
            rows.add(List.of(btn("✨ Начать Ритуал Эволюции!", "EVOLVE_EXECUTE")));
        }
        rows.add(List.of(btn("🔙 В Главное Меню", "NAV_MAIN")));

        InlineKeyboardMarkup markup = new InlineKeyboardMarkup();
        markup.setKeyboard(rows);
        return markup;
    }

    public InlineKeyboardMarkup createCasinoKeyboard() {
        List<List<InlineKeyboardButton>> rows = new ArrayList<>();

        rows.add(List.of(
                btn("🎲 Кости Гобуты (100 Стелл)", "CASINO_DICE_100"),
                btn("🎲 Кости Гобуты (500 Стелл)", "CASINO_DICE_500")
        ));

        rows.add(List.of(
                btn("🔴 Рулетка: Ифрит (Красное)", "CASINO_ROULETTE_RED"),
                btn("⚫ Рулетка: Вельдора (Черное)", "CASINO_ROULETTE_BLACK")
        ));

        rows.add(List.of(
                btn("🟢 Рулетка: Рамирис (Зеро x14)", "CASINO_ROULETTE_GREEN"),
                btn("🃏 Карточная дуэль с Ригурдом", "CASINO_CARDS_200")
        ));

        rows.add(List.of(btn("🔙 В Главное Меню", "NAV_MAIN")));

        InlineKeyboardMarkup markup = new InlineKeyboardMarkup();
        markup.setKeyboard(rows);
        return markup;
    }

    public InlineKeyboardMarkup createNamingKeyboard() {
        List<List<InlineKeyboardButton>> rows = new ArrayList<>();

        rows.add(List.of(
                btn("👺 Гоблин -> Хофгоблин (300 MP)", "NAME_CANDIDATE_GOBLIN"),
                btn("👹 Огр -> Киджин (3,500 MP)", "NAME_CANDIDATE_OGRE")
        ));

        rows.add(List.of(
                btn("🦎 Людоящер -> Драконид (1,200 MP)", "NAME_CANDIDATE_LIZARD"),
                btn("🐗 Орк -> Верховный Орк (750 MP)", "NAME_CANDIDATE_ORC")
        ));

        rows.add(List.of(
                btn("👥 Посмотреть список соратников", "NAV_SUBORDINATES"),
                btn("🔙 В Главное Меню", "NAV_MAIN")
        ));

        InlineKeyboardMarkup markup = new InlineKeyboardMarkup();
        markup.setKeyboard(rows);
        return markup;
    }

    public InlineKeyboardMarkup createInventoryKeyboard(List<Item> items, int page, int totalPages) {
        List<List<InlineKeyboardButton>> rows = new ArrayList<>();

        for (Item item : items) {
            String label = String.format("%s (x%d)", item.getName(), item.getQuantity());
            rows.add(List.of(btn(label, "INV_VIEW_" + item.getId())));
        }

        List<InlineKeyboardButton> navRow = new ArrayList<>();
        if (page > 1) {
            navRow.add(btn("⬅️ Назад", "INV_PAGE_" + (page - 1)));
        }
        navRow.add(btn(String.format("Стр. %d / %d", page, Math.max(1, totalPages)), "IGNORE"));
        if (page < totalPages) {
            navRow.add(btn("Вперед ➡️", "INV_PAGE_" + (page + 1)));
        }
        rows.add(navRow);

        rows.add(List.of(btn("🔙 В Главное Меню", "NAV_MAIN")));

        InlineKeyboardMarkup markup = new InlineKeyboardMarkup();
        markup.setKeyboard(rows);
        return markup;
    }

    public InlineKeyboardMarkup createBackToMainKeyboard() {
        InlineKeyboardMarkup markup = new InlineKeyboardMarkup();
        markup.setKeyboard(List.of(List.of(btn("🔙 В Главное Меню", "NAV_MAIN"))));
        return markup;
    }

    private static InlineKeyboardButton btn(String text, String callbackData) {
        InlineKeyboardButton button = new InlineKeyboardButton();
        button.setText(text);
        button.setCallbackData(callbackData);
        return button;
    }
}
