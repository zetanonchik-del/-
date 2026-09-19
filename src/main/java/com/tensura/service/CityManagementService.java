package com.tensura.service;

import com.tensura.entity.BunkerCity;
import com.tensura.entity.Item;
import com.tensura.entity.Player;
import com.tensura.repository.CityRepository;
import com.tensura.repository.ItemRepository;
import com.tensura.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CityManagementService {

    private final CityRepository cityRepository;
    private final PlayerRepository playerRepository;
    private final ItemRepository itemRepository;

    public static class CityUpgradeResult {
        public boolean success;
        public String buildingName;
        public int newLevel;
        public String message;
    }

    public static class CraftingResult {
        public boolean success;
        public String itemName;
        public String message;
    }

    @Transactional
    public BunkerCity getOrCreateCity(Long telegramId) {
        return cityRepository.findByPlayerTelegramId(telegramId).orElseGet(() -> {
            BunkerCity city = BunkerCity.builder()
                    .playerTelegramId(telegramId)
                    .cityName("Федерация Джура Темпест")
                    .cityLevel(1)
                    .population(50)
                    .assignedWorkers(10)
                    .blacksmithLevel(1)
                    .labLevel(1)
                    .tavernLevel(1)
                    .farmLevel(1)
                    .barrierLevel(1)
                    .magicOre(150L)
                    .juraTimber(300L)
                    .magicWater(60L)
                    .healingPotions(5L)
                    .uncollectedStellas(0L)
                    .lastResourceCollection(LocalDateTime.now())
                    .createdAt(LocalDateTime.now())
                    .build();
            return cityRepository.save(city);
        });
    }

    @Transactional
    public String collectResources(Long telegramId) {
        BunkerCity city = getOrCreateCity(telegramId);
        Player player = playerRepository.findByTelegramId(telegramId)
                .orElseThrow(() -> new IllegalStateException("Игрок не найден"));

        long prevOre = city.getMagicOre();
        long prevTimber = city.getJuraTimber();
        long prevWater = city.getMagicWater();
        long prevStellas = city.getUncollectedStellas();

        city.collectPassiveResources();

        long diffOre = city.getMagicOre() - prevOre;
        long diffTimber = city.getJuraTimber() - prevTimber;
        long diffWater = city.getMagicWater() - prevWater;
        long diffStellas = city.getUncollectedStellas() - prevStellas;

        if (city.getUncollectedStellas() > 0) {
            player.setStellas(player.getStellas() + city.getUncollectedStellas());
            city.setUncollectedStellas(0L);
        }

        cityRepository.save(city);
        playerRepository.save(player);

        if (diffOre == 0 && diffTimber == 0 && diffStellas == 0) {
            return "⏳ <i>«Великий Мудрец»: Ресурсы еще накапливаются. Сбор возможен каждые 5 минут.</i>";
        }

        return String.format(
                "🌾 <b>УРОЖАЙ И РЕСУРСЫ ТЕМПЕСТА СОБРАНЫ!</b>\n\n" +
                        "• 🪵 Древесина Джуры: <b>+%d</b> (Всего: %d)\n" +
                        "• ⛏️ Магическая руда: <b>+%d</b> (Всего: %d)\n" +
                        "• 💧 Магическая вода: <b>+%d</b> (Всего: %d)\n" +
                        "• 🪙 Налоги горожан: <b>+%d</b> Стелл переведены в кошелек!",
                diffTimber, city.getJuraTimber(),
                diffOre, city.getMagicOre(),
                diffWater, city.getMagicWater(),
                diffStellas
        );
    }

    @Transactional
    public CityUpgradeResult upgradeBuilding(Long telegramId, String buildingType) {
        BunkerCity city = getOrCreateCity(telegramId);
        Player player = playerRepository.findByTelegramId(telegramId)
                .orElseThrow(() -> new IllegalStateException("Игрок не найден"));

        int curLevel = city.getBuildingLevel(buildingType);
        long reqStellas = (curLevel + 1) * 700L;
        long reqTimber = (curLevel + 1) * 180L;
        long reqOre = (curLevel + 1) * 90L;

        CityUpgradeResult res = new CityUpgradeResult();

        if (player.getStellas() < reqStellas || city.getJuraTimber() < reqTimber || city.getMagicOre() < reqOre) {
            res.success = false;
            res.message = String.format(
                    "❌ <b>Недостаточно ресурсов для модернизации!</b>\n\nТребуется:\n• 🪙 Стеллы: %d / %d\n• 🪵 Древесина: %d / %d\n• ⛏️ Магическая руда: %d / %d",
                    player.getStellas(), reqStellas,
                    city.getJuraTimber(), reqTimber,
                    city.getMagicOre(), reqOre
            );
            return res;
        }

        player.setStellas(player.getStellas() - reqStellas);
        city.setJuraTimber(city.getJuraTimber() - reqTimber);
        city.setMagicOre(city.getMagicOre() - reqOre);

        String bName;
        int nextLevel = curLevel + 1;
        switch (buildingType.toUpperCase()) {
            case "BLACKSMITH" -> {
                city.setBlacksmithLevel(nextLevel);
                bName = "Кузница Куробе";
            }
            case "LAB" -> {
                city.setLabLevel(nextLevel);
                bName = "Лаборатория Бальмунда";
            }
            case "TAVERN" -> {
                city.setTavernLevel(nextLevel);
                bName = "Трактир Ригурда";
            }
            case "FARM" -> {
                city.setFarmLevel(nextLevel);
                bName = "Фермы Темпеста";
                city.setPopulation(city.getPopulation() + 25);
            }
            case "BARRIER" -> {
                city.setBarrierLevel(nextLevel);
                bName = "Защитный барьер Джуры";
            }
            default -> throw new IllegalArgumentException("Неизвестное здание: " + buildingType);
        }

        cityRepository.save(city);
        playerRepository.save(player);

        res.success = true;
        res.buildingName = bName;
        res.newLevel = nextLevel;
        res.message = String.format(
                "🏗️ <b>МОДЕРНИЗАЦИЯ СТОЛИЦЫ ЗАВЕРШЕНА!</b>\n\n" +
                        "Объект: <b>%s</b> успешно улучшен до <b>%d уровня</b>!\n" +
                        "<i>«Великий Мудрец»: Эффективность работы объекта увеличена. Приток ресурсов и лимиты повышены.</i>",
                bName, nextLevel
        );
        return res;
    }

    @Transactional
    public CraftingResult craftEquipment(Long telegramId, String itemName) {
        BunkerCity city = getOrCreateCity(telegramId);
        Player player = playerRepository.findByTelegramId(telegramId)
                .orElseThrow(() -> new IllegalStateException("Игрок не найден"));

        CraftingResult res = new CraftingResult();
        Optional<Item> recipeOpt = itemRepository.findByNameAndPlayerTelegramIdIsNull(itemName);

        if (recipeOpt.isEmpty()) {
            res.success = false;
            res.message = "❌ Чертеж не найден у Куробе!";
            return res;
        }

        Item recipe = recipeOpt.get();
        if (city.getBlacksmithLevel() < recipe.getRequiredForgeLevel()) {
            res.success = false;
            res.message = "⚠️ Кузница слишком низкого ранга! Требуется Кузница Куробе " + recipe.getRequiredForgeLevel() + " уровня.";
            return res;
        }

        if (city.getMagicOre() < recipe.getRequiredOre() || city.getJuraTimber() < recipe.getRequiredTimber()) {
            res.success = false;
            res.message = String.format("❌ Недостаточно материалов для ковки!\nТребуется: Руда (%d/%d), Древесина (%d/%d)",
                    city.getMagicOre(), recipe.getRequiredOre(),
                    city.getJuraTimber(), recipe.getRequiredTimber());
            return res;
        }

        city.setMagicOre(city.getMagicOre() - recipe.getRequiredOre());
        city.setJuraTimber(city.getJuraTimber() - recipe.getRequiredTimber());
        cityRepository.save(city);

        Item playerItem = recipe.createPlayerCopy(telegramId, 1);
        itemRepository.save(playerItem);

        res.success = true;
        res.itemName = recipe.getName();
        res.message = String.format(
                "⚒️ <b>КУРОБЕ ВЫКОВАЛ ПРЕДМЕТ!</b>\n\n" +
                        "Получено: <b>%s</b> [%s]\n" +
                        "• Бонус атаки: +%d\n• Бонус защиты: +%d\n• Описание: <i>%s</i>",
                recipe.getName(), recipe.getRarity(),
                recipe.getAttackBonus(), recipe.getDefenseBonus(),
                recipe.getDescription()
        );
        return res;
    }

    @Transactional
    public CraftingResult brewFullPotion(Long telegramId, int count) {
        BunkerCity city = getOrCreateCity(telegramId);
        CraftingResult res = new CraftingResult();

        long reqWater = count * 15L;
        if (city.getMagicWater() < reqWater) {
            res.success = false;
            res.message = String.format("❌ Недостаточно Магической воды из Пещеры Вельдоры! (Нужно: %d, в наличии: %d)",
                    reqWater, city.getMagicWater());
            return res;
        }

        city.setMagicWater(city.getMagicWater() - reqWater);
        city.setHealingPotions(city.getHealingPotions() + count);
        cityRepository.save(city);

        Optional<Item> potionInvOpt = itemRepository.findByNameAndPlayerTelegramId("Зелье полного восстановления Джуры", telegramId);
        if (potionInvOpt.isPresent()) {
            Item potion = potionInvOpt.get();
            potion.setQuantity(potion.getQuantity() + count);
            itemRepository.save(potion);
        } else {
            Item newPotion = Item.builder()
                    .playerTelegramId(telegramId)
                    .name("Зелье полного восстановления Джуры")
                    .itemType("POTION")
                    .rarity("RARE")
                    .description("Высокочистое зелье на основе магии Дракона Бури Вельдоры. Мгновенно восстанавливает HP и MP.")
                    .quantity(count)
                    .hpBonus(350)
                    .mpBonus(200)
                    .priceStellas(200L)
                    .priceCrystals(5L)
                    .consumable(true)
                    .usableInBattle(true)
                    .build();
            itemRepository.save(newPotion);
        }

        res.success = true;
        res.itemName = "Зелье полного восстановления Джуры";
        res.message = String.format(
                "🧪 <b>ЛАБОРАТОРИЯ БАЛЬМУНДА СИНТЕЗИРОВАЛА ЗЕЛЬЯ!</b>\n\n" +
                        "Успешно сварено: <b>%d шт.</b> [Зелье полного восстановления Джуры]\n" +
                        "<i>«Великий Мудрец»: Чистота концентрата магикул составляет 99.8%%. Добавлено в боевой инвентарь.</i>",
                count
        );
        return res;
    }
}
