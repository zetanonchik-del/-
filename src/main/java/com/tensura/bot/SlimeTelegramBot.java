package com.tensura.bot;

import com.tensura.config.BotConfig;
import com.tensura.entity.*;
import com.tensura.repository.*;
import com.tensura.service.*;
import com.tensura.ui.KeyboardFactory;
import com.tensura.ui.MessageFormatter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.updatingmessages.EditMessageText;
import org.telegram.telegrambots.meta.api.objects.CallbackQuery;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class SlimeTelegramBot extends TelegramLongPollingBot {

    private final BotConfig botConfig;
    private final PlayerRepository playerRepository;
    private final PlayerSkillRepository playerSkillRepository;
    private final ItemRepository itemRepository;
    private final SubordinateRepository subordinateRepository;
    private final CityRepository cityRepository;
    private final BattleSessionRepository battleSessionRepository;

    private final BattleEngineService battleEngineService;
    private final GreatSageAdvisorService greatSageAdvisorService;
    private final EvolutionService evolutionService;
    private final CityManagementService cityManagementService;
    private final NamingService namingService;
    private final CasinoMiniGamesService casinoMiniGamesService;
    private final DungeonLabyrinthService dungeonLabyrinthService;
    private final RaidBossService raidBossService;
    private final AuctionAndTradeService auctionAndTradeService;

    private final MessageFormatter formatter;
    private final KeyboardFactory keyboardFactory;
    private final Random random = new Random();

    @Override
    public String getBotUsername() {
        return botConfig.getBotName();
    }

    @Override
    public String getBotToken() {
        return botConfig.getBotToken();
    }

    @Override
    public void onUpdateReceived(Update update) {
        try {
            if (update.hasMessage() && update.getMessage().hasText()) {
                handleTextMessage(update.getMessage());
            } else if (update.hasCallbackQuery()) {
                handleCallbackQuery(update.getCallbackQuery());
            }
        } catch (Exception e) {
            log.error("Unhandled exception in onUpdateReceived", e);
        }
    }

    private void handleTextMessage(Message message) {
        Long chatId = message.getChatId();
        Long telegramId = message.getFrom().getId();
        String text = message.getText().trim();
        String username = message.getFrom().getUserName() != null ? message.getFrom().getUserName() : "Adventurer";
        String firstName = message.getFrom().getFirstName() != null ? message.getFrom().getFirstName() : "Слизь";

        log.info("Received command [{}] from [{} - @{}]", text, telegramId, username);

        Player player = getOrCreatePlayer(telegramId, username, firstName);

        if (player.isInComa()) {
            if (player.getComaUntil() != null && LocalDateTime.now().isBefore(player.getComaUntil())) {
                long minutesLeft = java.time.Duration.between(LocalDateTime.now(), player.getComaUntil()).toMinutes() + 1;
                sendHtml(chatId, String.format(
                        "💤 <b>ВЫ НАХОДИТЕСЬ В МАГИЧЕСКОМ АНАБИОЗЕ!</b>\n\n" +
                                "<i>«Великий Мудрец»: Попытка пробуждения отклонена. Ваше ядро восстанавливает плотность магикул после наречения монстра.\n" +
                                "Осталось спать: <b>%d мин.</b></i>", minutesLeft));
                return;
            } else {
                player.setInComa(false);
                player.setComaUntil(null);
                player.restoreFullHealth();
                playerRepository.save(player);
                sendHtml(chatId, "✨ <b>ВЫ ПРОБУДИЛИСЬ ОТО СНА!</b>\n<i>«Великий Мудрец»: Плотность магикул полностью восстановилась. Сущность стабилизирована.</i>");
            }
        }

        switch (text.toLowerCase()) {
            case "/start" -> sendWelcomeMessage(chatId, player);
            case "/profile", "/stats" -> showProfile(chatId, player);
            case "/forest", "/hunt" -> startWildForestHunt(chatId, player);
            case "/city", "/tempest" -> showCity(chatId, player);
            case "/labyrinth", "/dungeon" -> showLabyrinth(chatId, player);
            case "/raids" -> showRaids(chatId, player);
            case "/sage", "/raphael" -> showGreatSage(chatId, player);
            case "/evolution", "/evolve" -> showEvolution(chatId, player);
            case "/casino", "/tavern" -> showCasino(chatId, player);
            case "/naming", "/name" -> showNamingMenu(chatId, player);
            case "/inventory", "/inv" -> showInventory(chatId, player, 1);
            case "/top", "/leaderboard" -> showLeaderboard(chatId);
            default -> sendHtmlWithKeyboard(chatId,
                    "🌟 <b>ФЕДЕРАЦИЯ ДЖУРА ТЕМПЕСТ</b>\n<i>«Великий Мудрец: Команда не распознана. Используйте интерактивное меню ниже.»</i>",
                    keyboardFactory.createMainMenu());
        }
    }

    private void handleCallbackQuery(CallbackQuery cb) {
        Long chatId = cb.getMessage().getChatId();
        Integer messageId = cb.getMessage().getMessageId();
        Long telegramId = cb.getFrom().getId();
        String data = cb.getData();

        log.info("Callback [{}] from player [{}]", data, telegramId);

        Player player = playerRepository.findByTelegramId(telegramId)
                .orElseGet(() -> getOrCreatePlayer(telegramId, cb.getFrom().getUserName(), cb.getFrom().getFirstName()));

        if (player.isInComa()) {
            if (player.getComaUntil() != null && LocalDateTime.now().isBefore(player.getComaUntil())) {
                long minutesLeft = java.time.Duration.between(LocalDateTime.now(), player.getComaUntil()).toMinutes() + 1;
                editHtml(chatId, messageId, String.format(
                        "💤 <b>ВЫ НАХОДИТЕСЬ В МАГИЧЕСКОМ АНАБИОЗЕ!</b>\n\n" +
                                "<i>«Великий Мудрец»: Попытка действия отклонена. Ваше тело восстанавливается.\n" +
                                "Осталось спать: <b>%d мин.</b></i>", minutesLeft), keyboardFactory.createBackToMainKeyboard());
                return;
            } else {
                player.setInComa(false);
                player.setComaUntil(null);
                player.restoreFullHealth();
                playerRepository.save(player);
            }
        }

        if (data.equals("NAV_MAIN")) {
            sendWelcomeMessage(chatId, player);
        } else if (data.equals("NAV_PROFILE")) {
            showProfile(chatId, player);
        } else if (data.equals("NAV_FOREST")) {
            startWildForestHunt(chatId, player);
        } else if (data.equals("NAV_CITY")) {
            showCity(chatId, player);
        } else if (data.equals("NAV_LABYRINTH")) {
            showLabyrinth(chatId, player);
        } else if (data.equals("NAV_RAIDS")) {
            showRaids(chatId, player);
        } else if (data.equals("NAV_SAGE")) {
            showGreatSage(chatId, player);
        } else if (data.equals("NAV_EVOLUTION")) {
            showEvolution(chatId, player);
        } else if (data.equals("NAV_CASINO")) {
            showCasino(chatId, player);
        } else if (data.equals("NAV_NAMING")) {
            showNamingMenu(chatId, player);
        } else if (data.equals("NAV_SUBORDINATES")) {
            showSubordinates(chatId, player);
        } else if (data.equals("NAV_INVENTORY")) {
            showInventory(chatId, player, 1);
        } else if (data.equals("NAV_LEADERBOARD")) {
            showLeaderboard(chatId);
        } else if (data.equals("NAV_CARAVAN")) {
            showCaravan(chatId, player);
        }

        else if (data.equals("BATTLE_ATTACK")) {
            handleBattleAttack(chatId, messageId, player);
        } else if (data.equals("BATTLE_SKILL_MENU")) {
            handleBattleSkillMenu(chatId, messageId, player);
        } else if (data.startsWith("BATTLE_EXEC_SKILL_")) {
            Long skillId = Long.parseLong(data.substring("BATTLE_EXEC_SKILL_".length()));
            handleBattleExecuteSkill(chatId, messageId, player, skillId);
        } else if (data.equals("BATTLE_DEVOUR")) {
            handleBattleDevour(chatId, messageId, player);
        } else if (data.equals("BATTLE_POTION")) {
            handleBattlePotion(chatId, messageId, player);
        } else if (data.equals("BATTLE_SAGE_ADVICE")) {
            handleBattleSageAdvice(chatId, player);
        } else if (data.equals("BATTLE_FLEE")) {
            handleBattleFlee(chatId, messageId, player);
        } else if (data.equals("BATTLE_RETURN_MENU")) {
            showBattleScreen(chatId, messageId, player);
        }

        else if (data.equals("CITY_COLLECT")) {
            String report = cityManagementService.collectResources(telegramId);
            editHtml(chatId, messageId, report, keyboardFactory.createCityKeyboard());
        } else if (data.equals("CITY_UPGRADE_MENU")) {
            editHtml(chatId, messageId, "🏗️ <b>ВЫБЕРИТЕ ОБЪЕКТ ДЛЯ МОДЕРНИЗАЦИИ В ТЕМПЕСТЕ:</b>", keyboardFactory.createCityUpgradeMenu());
        } else if (data.startsWith("UPGRADE_BLD_")) {
            String bld = data.substring("UPGRADE_BLD_".length());
            CityManagementService.CityUpgradeResult ur = cityManagementService.upgradeBuilding(telegramId, bld);
            editHtml(chatId, messageId, ur.message, keyboardFactory.createCityKeyboard());
        } else if (data.equals("CITY_FORGE")) {
            showForge(chatId, messageId, player);
        } else if (data.startsWith("FORGE_CRAFT_")) {
            String itemToCraft = data.substring("FORGE_CRAFT_".length());
            CityManagementService.CraftingResult cr = cityManagementService.craftEquipment(telegramId, itemToCraft);
            editHtml(chatId, messageId, cr.message, keyboardFactory.createCityKeyboard());
        } else if (data.equals("CITY_LAB")) {
            CityManagementService.CraftingResult pr = cityManagementService.brewFullPotion(telegramId, 3);
            editHtml(chatId, messageId, pr.message, keyboardFactory.createCityKeyboard());
        } else if (data.equals("CITY_ARENA")) {
            AuctionAndTradeService.ArenaDuelResult adr = auctionAndTradeService.fightArenaDuel(player, "BENIMARU");
            editHtml(chatId, messageId, adr.combatSummary, keyboardFactory.createCityKeyboard());
        }

        else if (data.equals("LAB_EXPLORE")) {
            handleLabyrinthExplore(chatId, messageId, player);
        }

        else if (data.startsWith("RAID_START_")) {
            String bossTarget = data.substring("RAID_START_".length());
            handleRaidStart(chatId, player, bossTarget);
        }

        else if (data.equals("EVOLVE_EXECUTE")) {
            EvolutionService.EvolutionExecutionResult er = evolutionService.performEvolution(player);
            editHtml(chatId, messageId, er.storyNarrative, keyboardFactory.createBackToMainKeyboard());
        }

        else if (data.startsWith("NAME_CANDIDATE_")) {
            String spec = data.substring("NAME_CANDIDATE_".length());
            handleBestowNameCandidate(chatId, messageId, player, spec);
        }

        else if (data.startsWith("CASINO_DICE_")) {
            long bet = Long.parseLong(data.substring("CASINO_DICE_".length()));
            CasinoMiniGamesService.CasinoGameResult gr = casinoMiniGamesService.playGoblinDice(player, bet);
            editHtml(chatId, messageId, gr.title + "\n\n" + gr.details, keyboardFactory.createCasinoKeyboard());
        } else if (data.startsWith("CASINO_ROULETTE_")) {
            String col = data.substring("CASINO_ROULETTE_".length());
            CasinoMiniGamesService.CasinoGameResult gr = casinoMiniGamesService.playTempestRoulette(player, 100L, col);
            editHtml(chatId, messageId, gr.title + "\n\n" + gr.details, keyboardFactory.createCasinoKeyboard());
        } else if (data.equals("CASINO_CARDS_200")) {
            CasinoMiniGamesService.CasinoGameResult gr = casinoMiniGamesService.playCardDuel(player, 200L);
            editHtml(chatId, messageId, gr.title + "\n\n" + gr.details, keyboardFactory.createCasinoKeyboard());
        }

        else if (data.startsWith("INV_PAGE_")) {
            int targetPage = Integer.parseInt(data.substring("INV_PAGE_".length()));
            showInventory(chatId, player, targetPage);
        }
    }

    private void sendWelcomeMessage(Long chatId, Player player) {
        String text = String.format("""
                ╔═══════════════════════════╗
                   🌀 <b>TENSURA: REINCARNATED AS A SLIME</b>
                ╚═══════════════════════════╝
                
                Добро пожаловать в Великий Лес Джура, <b>%s</b>!
                Вы переродились в магическом мире в форме низшей синей слизи.
                
                Благодаря уникальным навыкам <b>«Великий Мудрец»</b> и <b>«Хищник»</b>, вам предстоит поглощать монстров, осваивать их способности, возвести несокрушимую столицу <b>Федерацию Темпест</b>, давать имена соратникам и взойти на трон <b>Истинного Владыки Демонов</b>!
                
                <i>«Великий Мудрец»: Система активирована. Все модули анализа готовы к работе. Выберите действие.</i>
                """, player.getNickname());

        sendHtmlWithKeyboard(chatId, text, keyboardFactory.createMainMenu());
    }

    private void showProfile(Long chatId, Player player) {
        List<Item> equipped = itemRepository.findByPlayerTelegramIdAndEquippedTrue(player.getTelegramId());
        int subsCount = subordinateRepository.countByMasterTelegramId(player.getTelegramId());
        String profileText = formatter.formatProfile(player, equipped, subsCount);
        sendHtmlWithKeyboard(chatId, profileText, keyboardFactory.createBackToMainKeyboard());
    }

    private void showCity(Long chatId, Player player) {
        BunkerCity city = cityManagementService.getOrCreateCity(player.getTelegramId());
        String cityText = formatter.formatCity(city, player.getStellas());
        sendHtmlWithKeyboard(chatId, cityText, keyboardFactory.createCityKeyboard());
    }

    private void showLabyrinth(Long chatId, Player player) {
        String text = String.format("""
                ╔═══════════════════════════╗
                   🌀 <b>ПОДЗЕМНЫЙ ЛАБИРИНТ РАМИРИС</b>
                ╚═══════════════════════════╝
                
                Вы стоите перед сверкающим порталом 100-этажного пространственного лабиринта Владычицы Лабиринтов Рамирис!
                
                📍 <b>Текущий этаж:</b> <b>[%d / 100]</b>
                🏆 <b>Ваш персональный рекорд:</b> <b>[%d этаж]</b>
                
                <i>Каждые 10 этажей вас ожидает смертоносный Босс-Страж (Тренты, Рыцари Смерти, Големы, Змеи, Зегион и проекция Вельдоры!).
                Наденьте Браслет Воскрешения Рамирис и шагните в неизведанное!</i>
                """, player.getCurrentLabyrinthFloor(), player.getHighestLabyrinthFloor());

        sendHtmlWithKeyboard(chatId, text, keyboardFactory.createLabyrinthKeyboard(player.getCurrentLabyrinthFloor()));
    }

    private void showRaids(Long chatId, Player player) {
        String text = """
                ╔═══════════════════════════╗
                   ⚔️ <b>РЕЙДЫ НА МИРОВЫЕ БЕДСТВИЯ</b>
                ╚═══════════════════════════╝
                
                Древние катастрофы угрожают покою Великого Леса Джура!
                Сразитесь с легендарными врагами, чтобы добыть ядра душ и мифические реликвии:
                
                1. 🔥 <b>Ифрит (Дух Пламени Леона)</b> [Ранг Special A]
                2. 🍖 <b>Орк-Дикарь Гельд (Orc Disaster)</b> [Ранг Disaster]
                3. 🌊 <b>Харибда (Повелитель Левиафанов)</b> [Ранг Calamity]
                
                <i>«Великий Мудрец»: Внимание! Перед штурмом убедитесь в наличии запаса зелий и барьеров.</i>
                """;

        sendHtmlWithKeyboard(chatId, text, keyboardFactory.createRaidsKeyboard());
    }

    private void showGreatSage(Long chatId, Player player) {
        String advice = greatSageAdvisorService.getGeneralStatusAdvice(player);
        sendHtmlWithKeyboard(chatId, advice, keyboardFactory.createBackToMainKeyboard());
    }

    private void showEvolution(Long chatId, Player player) {
        EvolutionService.EvolutionCheckResult check = evolutionService.checkEvolutionEligibility(player);
        StringBuilder sb = new StringBuilder();
        sb.append("╔═══════════════════════════╗\n");
        sb.append("   ✨ <b>СИСТЕМА ЭВОЛЮЦИИ СУЩНОСТИ</b>\n");
        sb.append("╚═══════════════════════════╝\n\n");
        sb.append("Текущая форма: <b>").append(player.getRace()).append("</b> [").append(player.getRank()).append("]\n");
        sb.append("Следующая ступень: <b>").append(check.nextFormName).append("</b>\n\n");
        sb.append("📋 <b>Условия эволюции:</b>\n").append(check.requirementsText).append("\n\n");
        sb.append("🎁 <b>Бонусы после трансформации:</b>\n").append(check.benefitsText).append("\n\n");

        if (check.eligible) {
            sb.append("🌟 <i>«Великий Мудрец»: Все условия выполнены! Тело готово к перерождению.</i>");
        } else {
            sb.append("⏳ <i>«Великий Мудрец»: Накапливайте опыт, магикулы и души побежденных монстров.</i>");
        }

        sendHtmlWithKeyboard(chatId, sb.toString(), keyboardFactory.createEvolutionKeyboard(check.eligible));
    }

    private void showCasino(Long chatId, Player player) {
        String text = String.format("""
                ╔═══════════════════════════╗
                   🍻 <b>ТРАКТИР РИГУРДА И КАЗИНО</b>
                ╚═══════════════════════════╝
                
                В таверне шумно и весело! Гоблины празднуют очередную победу, а бродячий купец Мьельмиль крутит магическую рулетку.
                
                💰 <b>Ваш кошелек:</b> <b>%s Стелл</b>
                
                Испытайте удачу в играх Темпеста:
                • 🎲 Бросьте кости против озорного Гобуты!
                • 🎡 Сделайте ставку на цвета рулетки (Красный Ифрит, Черный Вельдора или Зеро Рамирис)!
                • 🃏 Сыграйте в карточную дуэль лично со старейшиной Ригурдом!
                """, String.format("%,d", player.getStellas()));

        sendHtmlWithKeyboard(chatId, text, keyboardFactory.createCasinoKeyboard());
    }

    private void showNamingMenu(Long chatId, Player player) {
        String text = String.format("""
                ╔═══════════════════════════╗
                   👥 <b>СИСТЕМА НАРЕЧЕНИЯ ИМЕНЕМ</b>
                ╚═══════════════════════════╝
                
                В мире монстров имена обладают абсолютной силой!
                Даруя имя безымянному существу, вы тратите постоянную долю своих магикул, навсегда связывая его с собой Коридором Душ.
                
                🔮 <b>Ваш текущий запас магикул:</b> <b>%d / %d MP</b>
                
                ⚠️ <i>«Предупреждение Великого Мудреца»: Если потратить слишком много магикул при остатке менее 20%%, ваше тело впадет в состояние сна (магический анабиоз) для регенерации ядра!</i>
                
                Выберите монстра, жаждущего получить имя:
                """, player.getMp(), player.getMaxMp());

        sendHtmlWithKeyboard(chatId, text, keyboardFactory.createNamingKeyboard());
    }

    private void showSubordinates(Long chatId, Player player) {
        List<Subordinate> list = subordinateRepository.findByMasterTelegramId(player.getTelegramId());
        String text = formatter.formatSubordinatesList(list);
        sendHtmlWithKeyboard(chatId, text, keyboardFactory.createBackToMainKeyboard());
    }

    private void showInventory(Long chatId, Player player, int page) {
        List<Item> allItems = itemRepository.findByPlayerTelegramId(player.getTelegramId());
        int pageSize = 6;
        int totalPages = Math.max(1, (int) Math.ceil((double) allItems.size() / pageSize));
        int curPage = Math.min(Math.max(1, page), totalPages);

        int fromIdx = (curPage - 1) * pageSize;
        int toIdx = Math.min(fromIdx + pageSize, allItems.size());
        List<Item> pageItems = allItems.subList(fromIdx, toIdx);

        String text = formatter.formatInventory(pageItems);
        sendHtmlWithKeyboard(chatId, text, keyboardFactory.createInventoryKeyboard(pageItems, curPage, totalPages));
    }

    private void showLeaderboard(Long chatId) {
        List<Player> topPlayers = playerRepository.findTopLeaderboard();
        StringBuilder sb = new StringBuilder();
        sb.append("╔═══════════════════════════╗\n");
        sb.append("   🏆 <b>ЗАЛ СЛАВЫ: ВЕЛИЧАЙШИЕ ПОВЕЛИТЕЛИ</b>\n");
        sb.append("╚═══════════════════════════╝\n\n");

        int rank = 1;
        for (Player p : topPlayers) {
            sb.append(rank).append(". <b>").append(p.getNickname()).append("</b> [").append(p.getRace()).append("]\n")
                    .append("   • Уровень: <b>").append(p.getLevel()).append("</b> | Лабиринт: <b>")
                    .append(p.getHighestLabyrinthFloor()).append(" эт.</b> | Казна: <b>")
                    .append(String.format("%,d", p.getStellas())).append(" Стелл</b>\n\n");
            rank++;
            if (rank > 10) break;
        }

        sendHtmlWithKeyboard(chatId, sb.toString(), keyboardFactory.createBackToMainKeyboard());
    }

    private void showCaravan(Long chatId, Player player) {
        List<Item> catalog = auctionAndTradeService.getCaravanGoods();
        StringBuilder sb = new StringBuilder();
        sb.append("╔═══════════════════════════╗\n");
        sb.append("   🏪 <b>ТОРГОВЫЙ КАРАВАН МЬЕЛЬМИЛЯ</b>\n");
        sb.append("╚═══════════════════════════╝\n\n");
        sb.append("💰 Ваше золото: <b>").append(String.format("%,d", player.getStellas())).append(" Стелл</b>\n\n");

        if (catalog.isEmpty()) {
            sb.append("Караван разгружает новые повозки из Дворгона. Возвращайтесь позже!\n");
        } else {
            for (Item it : catalog) {
                sb.append("• <b>").append(it.getName()).append("</b> [").append(it.getRarity()).append("]\n")
                        .append("   Цена: <b>").append(it.getPriceStellas()).append(" Стелл</b> | ").append(it.getDescription()).append("\n\n");
            }
        }

        sendHtmlWithKeyboard(chatId, sb.toString(), keyboardFactory.createBackToMainKeyboard());
    }

    private void showForge(Long chatId, Integer messageId, Player player) {
        BunkerCity city = cityManagementService.getOrCreateCity(player.getTelegramId());
        List<Item> recipes = itemRepository.findCraftableRecipes(city.getBlacksmithLevel());

        StringBuilder sb = new StringBuilder();
        sb.append("╔═══════════════════════════╗\n");
        sb.append("   ⚒️ <b>КУЗНИЦА КУРОБЕ В ТЕМПЕСТЕ</b>\n");
        sb.append("╚═══════════════════════════╝\n\n");
        sb.append("Мастер Куробе вытирает пот со лба и показывает доступные чертежи оружия и брони:\n");
        sb.append("• Руда в наличии: <b>").append(city.getMagicOre()).append("</b> шт.\n");
        sb.append("• Древесина в наличии: <b>").append(city.getJuraTimber()).append("</b> шт.\n\n");

        editHtml(chatId, messageId, sb.toString(), keyboardFactory.createForgeRecipesKeyboard(recipes));
    }

    private void startWildForestHunt(Long chatId, Player player) {
        if (!player.consumeStamina(15)) {
            sendHtml(chatId, "⚡ <b>Недостаточно выносливости для экспедиции в Лес Джура!</b> (Требуется: 15 ед.). Она восстанавливается каждые несколько минут.");
            return;
        }

        Monster wildMonster = generateForestMonster(player.getLevel());
        BattleSession session = battleEngineService.startBattle(player, wildMonster, "WILDERNESS", 0);
        String text = formatter.formatBattleScreen(session, player);
        sendHtmlWithKeyboard(chatId, text, keyboardFactory.createBattleKeyboard());
    }

    private void handleBattleAttack(Long chatId, Integer messageId, Player player) {
        BattleEngineService.TurnResult res = battleEngineService.executePlayerAttack(player.getTelegramId());
        updateBattleView(chatId, messageId, player, res);
    }

    private void handleBattleSkillMenu(Long chatId, Integer messageId, Player player) {
        List<PlayerSkill> skills = playerSkillRepository.findByPlayerTelegramId(player.getTelegramId());
        editHtml(chatId, messageId, "🔥 <b>ВЫБЕРИТЕ УМЕНИЕ ДЛЯ АКТИВАЦИИ:</b>",
                keyboardFactory.createBattleSkillSelectionKeyboard(skills));
    }

    private void handleBattleExecuteSkill(Long chatId, Integer messageId, Player player, Long skillId) {
        BattleEngineService.TurnResult res = battleEngineService.executePlayerSkill(player.getTelegramId(), skillId);
        updateBattleView(chatId, messageId, player, res);
    }

    private void handleBattleDevour(Long chatId, Integer messageId, Player player) {
        BattleEngineService.TurnResult res = battleEngineService.executeBattleDevour(player.getTelegramId());
        updateBattleView(chatId, messageId, player, res);
    }

    private void handleBattlePotion(Long chatId, Integer messageId, Player player) {
        BattleEngineService.TurnResult res = battleEngineService.executeUsePotion(player.getTelegramId());
        updateBattleView(chatId, messageId, player, res);
    }

    private void handleBattleSageAdvice(Long chatId, Player player) {
        battleSessionRepository.findByPlayerTelegramId(player.getTelegramId()).ifPresent(session -> {
            Monster m = Monster.builder()
                    .name(session.getMonsterName())
                    .species(session.getMonsterSpecies())
                    .rank(session.getMonsterRank())
                    .level(player.getLevel())
                    .hp(session.getMonsterHp())
                    .maxHp(session.getMonsterMaxHp())
                    .mp(session.getMonsterMaxHp())
                    .attack(session.getMonsterAttack())
                    .defense(session.getMonsterDefense())
                    .agility(session.getMonsterAgility())
                    .intelligence(50)
                    .extractableSkillName(session.getExtractableSkill())
                    .build();
            String advice = greatSageAdvisorService.analyzeMonsterForBattle(player, m);
            sendHtml(chatId, advice);
        });
    }

    private void handleBattleFlee(Long chatId, Integer messageId, Player player) {
        BattleEngineService.TurnResult res = battleEngineService.executeFlee(player.getTelegramId());
        if (res.battleEnded) {
            editHtml(chatId, messageId, res.actionLog, keyboardFactory.createBackToMainKeyboard());
        } else {
            updateBattleView(chatId, messageId, player, res);
        }
    }

    private void updateBattleView(Long chatId, Integer messageId, Player player, BattleEngineService.TurnResult res) {
        if (res.battleEnded) {
            editHtml(chatId, messageId, res.actionLog, keyboardFactory.createBackToMainKeyboard());
        } else {
            String text = formatter.formatBattleScreen(res.session, player);
            editHtml(chatId, messageId, text, keyboardFactory.createBattleKeyboard());
        }
    }

    private void showBattleScreen(Long chatId, Integer messageId, Player player) {
        battleSessionRepository.findByPlayerTelegramId(player.getTelegramId()).ifPresent(session -> {
            String text = formatter.formatBattleScreen(session, player);
            editHtml(chatId, messageId, text, keyboardFactory.createBattleKeyboard());
        });
    }

    private void handleLabyrinthExplore(Long chatId, Integer messageId, Player player) {
        if (!player.consumeStamina(10)) {
            editHtml(chatId, messageId, "⚡ <b>Недостаточно выносливости для исследования Лабиринта!</b>", keyboardFactory.createBackToMainKeyboard());
            return;
        }

        DungeonLabyrinthService.LabyrinthExploreEvent ev = dungeonLabyrinthService.exploreFloor(player);
        if (ev.type == DungeonLabyrinthService.EventType.MONSTER_AMBUSH || ev.type == DungeonLabyrinthService.EventType.BOSS_CHAMBER) {
            BattleSession session = battleEngineService.startBattle(player, ev.monster, "LABYRINTH", player.getCurrentLabyrinthFloor());
            String text = ev.title + "\n" + ev.description + "\n\n" + formatter.formatBattleScreen(session, player);
            editHtml(chatId, messageId, text, keyboardFactory.createBattleKeyboard());
        } else {
            String text = ev.title + "\n\n" + ev.description;
            editHtml(chatId, messageId, text, keyboardFactory.createLabyrinthKeyboard(player.getCurrentLabyrinthFloor()));
        }
    }

    private void handleRaidStart(Long chatId, Player player, String target) {
        Optional<Monster> bossOpt = raidBossService.findRaidBossByName(target);
        if (bossOpt.isEmpty()) {
            sendHtml(chatId, "❌ Рейдовый босс не найден!");
            return;
        }

        Monster boss = bossOpt.get();
        BattleSession session = battleEngineService.startBattle(player, boss, "RAID", 0);
        String text = "🚨 <b>ТРЕВОГА! ВЫ БРОСИЛИ ВЫЗОВ БЕДСТВИЮ:</b>\n" +
                "<b>" + boss.getName() + "</b>\n\n" +
                formatter.formatBattleScreen(session, player);

        sendHtmlWithKeyboard(chatId, text, keyboardFactory.createBattleKeyboard());
    }

    private void handleBestowNameCandidate(Long chatId, Integer messageId, Player player, String speciesCode) {
        String speciesName = switch (speciesCode) {
            case "GOBLIN" -> "Гоблин";
            case "OGRE" -> "Огр";
            case "LIZARD" -> "Людоящер";
            case "ORC" -> "Орк";
            default -> "Гоблин";
        };

        String defaultName = switch (speciesCode) {
            case "GOBLIN" -> "Ригурд";
            case "OGRE" -> "Бенимару";
            case "LIZARD" -> "Габил";
            case "ORC" -> "Гельд";
            default -> "Соратник";
        };

        NamingService.NamingResult nr = namingService.bestowName(player, speciesName, defaultName);
        editHtml(chatId, messageId, nr.message, keyboardFactory.createBackToMainKeyboard());
    }

    private Player getOrCreatePlayer(Long telegramId, String username, String nickname) {
        return playerRepository.findByTelegramId(telegramId).orElseGet(() -> {
            Player p = Player.builder()
                    .telegramId(telegramId)
                    .username(username != null ? username : "SlimeMaster")
                    .nickname(nickname != null ? nickname : "Римуру")
                    .race("Слизь (Slime)")
                    .rank("F (Низший монстр)")
                    .level(1)
                    .exp(0L)
                    .maxExp(100L)
                    .hp(120).maxHp(120)
                    .mp(250).maxMp(250)
                    .attack(18).defense(22).agility(14).intelligence(30)
                    .stamina(100).maxStamina(100)
                    .stellas(500L).magicCrystals(10L)
                    .currentLabyrinthFloor(1).highestLabyrinthFloor(1)
                    .build();

            Player saved = playerRepository.save(p);

            seedStarterSkills(telegramId);
            
            cityManagementService.getOrCreateCity(telegramId);
            
            Item starterPotion = Item.builder()
                    .playerTelegramId(telegramId)
                    .name("Зелье полного восстановления Джуры")
                    .itemType("POTION")
                    .rarity("RARE")
                    .description("Зелье на основе магии Вельдоры. Восстанавливает здоровье и магикулы.")
                    .quantity(3)
                    .hpBonus(350).mpBonus(200)
                    .priceStellas(200L).priceCrystals(5L)
                    .consumable(true).usableInBattle(true)
                    .build();
            itemRepository.save(starterPotion);

            return saved;
        });
    }

    private void seedStarterSkills(Long telegramId) {
        PlayerSkill sage = PlayerSkill.builder()
                .playerTelegramId(telegramId)
                .skillName("Великий Мудрец")
                .japaneseName("大賢者 (グレートセージ)")
                .skillType("UNIQUE")
                .description("Встроенный советник: глубокий анализ противников, расчет вероятностей и тактики.")
                .mpCost(15)
                .powerMultiplier(1.0)
                .effectType("ANALYZE")
                .masteryLevel(1)
                .equipped(true)
                .build();

        PlayerSkill predator = PlayerSkill.builder()
                .playerTelegramId(telegramId)
                .skillName("Хищник")
                .japaneseName("捕食者 (プレデター)")
                .skillType("UNIQUE")
                .description("Поглощение ослабленного врага, извлечение его умений и органической материи.")
                .mpCost(30)
                .powerMultiplier(2.2)
                .effectType("DEVOUR")
                .masteryLevel(1)
                .equipped(true)
                .build();

        PlayerSkill waterBlade = PlayerSkill.builder()
                .playerTelegramId(telegramId)
                .skillName("Водяные лезвия")
                .japaneseName("水刃 (Suijin)")
                .skillType("COMBAT")
                .description("Струи воды под чудовищным давлением, рассекающие сталь и плоть монстров.")
                .mpCost(25)
                .powerMultiplier(1.6)
                .effectType("DAMAGE")
                .masteryLevel(1)
                .equipped(true)
                .build();

        PlayerSkill barrier = PlayerSkill.builder()
                .playerTelegramId(telegramId)
                .skillName("Барьер искажения")
                .japaneseName("歪曲結界")
                .skillType("COMBAT")
                .description("Магическое силовое поле, поглощающее физический и элементальный урон.")
                .mpCost(35)
                .powerMultiplier(1.5)
                .effectType("SHIELD")
                .masteryLevel(1)
                .equipped(true)
                .build();

        playerSkillRepository.saveAll(List.of(sage, predator, waterBlade, barrier));
    }

    private Monster generateForestMonster(int playerLevel) {
        String[] forestNames = {
                "Рогатый Кролик Джуры", "Клыкстый Волк", "Огромная Жаба Пещеры",
                "Гигантская Гусеница", "Черная Змея", "Бронированный Бронекопытник"
        };
        String[] species = {"Зверь", "Волчий демон", "Амфибия", "Насекомое", "Рептилия", "Копытный монстр"};
        int idx = random.nextInt(forestNames.length);

        int lvl = Math.max(1, playerLevel + random.nextInt(3) - 1);
        int hp = 60 + (lvl * 25);
        int atk = 12 + (lvl * 5);
        int def = 10 + (lvl * 4);
        int agi = 8 + (lvl * 3);

        String rank = (lvl < 5) ? "F" : (lvl < 15) ? "E" : (lvl < 30) ? "D" : "C";

        return Monster.builder()
                .name(forestNames[idx])
                .species(species[idx])
                .rank(rank)
                .level(lvl)
                .hp(hp).maxHp(hp).mp(hp * 2)
                .attack(atk).defense(def).agility(agi).intelligence(20)
                .expReward(25L + (lvl * 15L))
                .stellasReward(40L + (lvl * 20L))
                .crystalsReward((lvl > 10) ? 1L : 0L)
                .extractableSkillName((idx == 4) ? "Ядовитое дыхание" : (idx == 1) ? "Чувство угрозы" : null)
                .droppedItemName("Шкура монстра Джуры")
                .dropRate(0.50)
                .build();
    }

    private void sendHtml(Long chatId, String text) {
        SendMessage sm = new SendMessage();
        sm.setChatId(chatId);
        sm.setText(text);
        sm.setParseMode("HTML");
        try {
            execute(sm);
        } catch (TelegramApiException e) {
            log.error("Error executing sendHtml to [{}]", chatId, e);
        }
    }

    private void sendHtmlWithKeyboard(Long chatId, String text, org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup markup) {
        SendMessage sm = new SendMessage();
        sm.setChatId(chatId);
        sm.setText(text);
        sm.setParseMode("HTML");
        sm.setReplyMarkup(markup);
        try {
            execute(sm);
        } catch (TelegramApiException e) {
            log.error("Error executing sendHtmlWithKeyboard to [{}]", chatId, e);
        }
    }

    private void editHtml(Long chatId, Integer messageId, String text, org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup markup) {
        EditMessageText em = new EditMessageText();
        em.setChatId(chatId);
        em.setMessageId(messageId);
        em.setText(text);
        em.setParseMode("HTML");
        em.setReplyMarkup(markup);
        try {
            execute(em);
        } catch (TelegramApiException e) {
            
            sendHtmlWithKeyboard(chatId, text, markup);
        }
    }
}
