package com.tensura.service;

import com.tensura.entity.Monster;
import com.tensura.entity.Player;
import com.tensura.repository.ItemRepository;
import com.tensura.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class DungeonLabyrinthService {

    private final PlayerRepository playerRepository;
    private final ItemRepository itemRepository;
    private final Random random = new Random();

    public enum EventType {
        MONSTER_AMBUSH,
        TREASURE_CHEST,
        MAGIC_TRAP,
        REST_SANCTUARY,
        BOSS_CHAMBER
    }

    public static class LabyrinthExploreEvent {
        public EventType type;
        public Monster monster;
        public String title;
        public String description;
        public long gainedStellas;
        public long gainedCrystals;
        public int gainedHp;
        public int damageTaken;
    }

    /**
     * Explore the current floor of Ramiris Labyrinth.
     */
    @Transactional
    public LabyrinthExploreEvent exploreFloor(Player player) {
        log.info("Player [{}] exploring Labyrinth floor [{}]", player.getTelegramId(), player.getCurrentLabyrinthFloor());

        int floor = player.getCurrentLabyrinthFloor();
        LabyrinthExploreEvent event = new LabyrinthExploreEvent();

        // Check if boss floor (every 10th floor)
        if (floor % 10 == 0) {
            event.type = EventType.BOSS_CHAMBER;
            event.monster = generateBossForFloor(floor);
            event.title = String.format("👑 <b>ТРОННЫЙ ЗАЛ ХРАНИТЕЛЯ ЭТАЖА [%d]</b>", floor);
            event.description = String.format(
                    "Перед вами распахиваются титанические врата. Раздается громогласный смех Владычицы Лабиринта Рамирис:\n" +
                            "<i>«Хи-хи-хи! Ты осмелился дойти до %d этажа? Посмотрим, выдержишь ли ты мощь моего сильнейшего Стража!»</i>\n\n" +
                            "Из глубин зала выступает: <b>%s</b> [%s]!",
                    floor, event.monster.getName(), event.monster.getRank()
            );
            return event;
        }

        // Random roll for non-boss floors
        double roll = random.nextDouble();
        if (roll < 0.55) {
            // Regular monster encounter
            event.type = EventType.MONSTER_AMBUSH;
            event.monster = generateWildMonsterForFloor(floor);
            event.title = String.format("⚔️ <b>ЗАСАДА НА ЭТАЖЕ [%d]</b>", floor);
            event.description = String.format(
                    "В лабиринтных коридорах из теней материализуется враждебная сущность!\nВраг: <b>%s</b> [%s] (Ур. %d)!",
                    event.monster.getName(), event.monster.getRank(), event.monster.getLevel()
            );
        } else if (roll < 0.75) {
            // Treasure chest
            event.type = EventType.TREASURE_CHEST;
            long foundStellas = 150L + (floor * 35L) + random.nextInt(100);
            long foundCrystals = (floor >= 15) ? (1 + (floor / 10)) : 0;
            player.setStellas(player.getStellas() + foundStellas);
            player.setMagicCrystals(player.getMagicCrystals() + foundCrystals);
            playerRepository.save(player);

            event.gainedStellas = foundStellas;
            event.gainedCrystals = foundCrystals;
            event.title = String.format("💎 <b>ДРЕВНИЙ СУНДУК ЛАБИРИНТА (ЭТАЖ %d)</b>", floor);
            event.description = String.format(
                    "Вы обнаружили запечатанный ларец с кристаллами Джуры!\n\n" +
                            "• Найдено: <b>+%d Стелл</b>\n" +
                            (foundCrystals > 0 ? ("• Магические кристаллы: <b>+" + foundCrystals + " шт.</b>\n") : "") +
                            "<i>«Великий Мудрец»: Ловушек внутри не обнаружено. Ценности извлечены.</i>",
                    foundStellas
            );
        } else if (roll < 0.90) {
            // Magic trap
            event.type = EventType.MAGIC_TRAP;
            int trapDmg = Math.max(10, (int) (player.getMaxHp() * 0.12));
            player.takeDamage(trapDmg);
            playerRepository.save(player);

            event.damageTaken = trapDmg;
            event.title = String.format("💥 <b>МАГИЧЕСКАЯ ЛОВУШКА РАМИРИС (ЭТАЖ %d)</b>", floor);
            event.description = String.format(
                    "Пол под вами озаряется руническим кругом! Взрыв магических искр опаляет слизь!\n\n" +
                            "• Получено урона: <b>-%d HP</b>\n" +
                            "<i>«Великий Мудрец»: Логическая защита не успела среагировать. Активируйте регенерацию.</i>",
                    trapDmg
            );
        } else {
            // Rest sanctuary
            event.type = EventType.REST_SANCTUARY;
            int heal = (int) (player.getMaxHp() * 0.40);
            int restoreMp = (int) (player.getMaxMp() * 0.35);
            player.heal(heal);
            player.restoreMp(restoreMp);
            playerRepository.save(player);

            event.gainedHp = heal;
            event.title = String.format("🕊️ <b>СВЯТИЛИЩЕ ФЕИ РАМИРИС (ЭТАЖ %d)</b>", floor);
            event.description = String.format(
                    "Вы набрели на кристальный источник живительной магии!\n\n" +
                            "• Восстановлено: <b>+%d HP</b> и <b>+%d MP</b>!\n" +
                            "<i>«Великий Мудрец»: Плотность магикул полностью стабилизирована.</i>",
                    heal, restoreMp
            );
        }

        return event;
    }

    private Monster generateBossForFloor(int floor) {
        return switch (floor) {
            case 10 -> Monster.builder()
                    .name("Древний Трент-Страж")
                    .species("Растительный колосс")
                    .rank("B")
                    .level(15)
                    .hp(650).maxHp(650).mp(400)
                    .attack(75).defense(90).agility(25).intelligence(50)
                    .expReward(450L).stellasReward(1200L).crystalsReward(5L)
                    .extractableSkillName("Корневой захват")
                    .droppedItemName("Ядро Древнего Древа")
                    .dropRate(0.8)
                    .isBoss(true)
                    .elementalWeakness("FIRE")
                    .build();
            case 20 -> Monster.builder()
                    .name("Призрачный Рыцарь Смерти")
                    .species("Нежить высшего порядка")
                    .rank("A")
                    .level(28)
                    .hp(1450).maxHp(1450).mp(900)
                    .attack(160).defense(140).agility(85).intelligence(110)
                    .expReward(1200L).stellasReward(3000L).crystalsReward(12L)
                    .extractableSkillName("Аура устрашения")
                    .droppedItemName("Клинок Темного Проклятия")
                    .dropRate(0.6)
                    .isBoss(true)
                    .elementalWeakness("HOLY")
                    .build();
            case 30 -> Monster.builder()
                    .name("Буревая Змея Пещеры Вельдоры")
                    .species("Драконидский змей")
                    .rank("A+")
                    .level(38)
                    .hp(2800).maxHp(2800).mp(1800)
                    .attack(240).defense(190).agility(130).intelligence(170)
                    .expReward(2500L).stellasReward(6000L).crystalsReward(25L)
                    .extractableSkillName("Ядовитое дыхание Бури")
                    .droppedItemName("Чешуя Буревого Змея")
                    .dropRate(0.7)
                    .isBoss(true)
                    .elementalWeakness("WATER")
                    .build();
            case 40 -> Monster.builder()
                    .name("Огненный Драконид Ифрита")
                    .species("Пламенный дракон")
                    .rank("Special A")
                    .level(48)
                    .hp(4900).maxHp(4900).mp(3200)
                    .attack(390).defense(290).agility(210).intelligence(280)
                    .expReward(5500L).stellasReward(12000L).crystalsReward(40L)
                    .extractableSkillName("Огненный смерч")
                    .droppedItemName("Пламенное Сердце Дракона")
                    .dropRate(0.8)
                    .isBoss(true)
                    .elementalWeakness("WATER")
                    .build();
            case 50 -> Monster.builder()
                    .name("Гозурл и Мезурл (Хранители Бездны)")
                    .species("Быкоголовые демоны")
                    .rank("Disaster")
                    .level(58)
                    .hp(8200).maxHp(8200).mp(4500)
                    .attack(580).defense(480).agility(260).intelligence(320)
                    .expReward(11000L).stellasReward(25000L).crystalsReward(80L)
                    .extractableSkillName("Сокрушающий таран")
                    .droppedItemName("Рога Несокрушимости")
                    .dropRate(0.9)
                    .isBoss(true)
                    .build();
            case 60 -> Monster.builder()
                    .name("Беретта (Кукольный Голем Магии)")
                    .species("Архидемон в големе")
                    .rank("Disaster")
                    .level(68)
                    .hp(14000).maxHp(14000).mp(9000)
                    .attack(890).defense(780).agility(420).intelligence(650)
                    .expReward(22000L).stellasReward(50000L).crystalsReward(150L)
                    .extractableSkillName("Стальная кукла искажения")
                    .droppedItemName("Ядро Магической Стали")
                    .dropRate(0.9)
                    .isBoss(true)
                    .build();
            case 70 -> Monster.builder()
                    .name("Кумара (Девятихвостый Зверь Бездны)")
                    .species("Лорд мифических зверей")
                    .rank("Calamity")
                    .level(78)
                    .hp(24000).maxHp(24000).mp(16000)
                    .attack(1350).defense(1100).agility(680).intelligence(980)
                    .expReward(45000L).stellasReward(100000L).crystalsReward(300L)
                    .extractableSkillName("Хвосты иллюзорного распада")
                    .droppedItemName("Девятихвостый Мех")
                    .dropRate(1.0)
                    .isBoss(true)
                    .build();
            case 80 -> Monster.builder()
                    .name("Адалман (Король-Скелет Бессмертия)")
                    .species("Владыка Нежити")
                    .rank("Calamity")
                    .level(88)
                    .hp(41000).maxHp(41000).mp(35000)
                    .attack(2100).defense(1800).agility(900).intelligence(2400)
                    .expReward(90000L).stellasReward(220000L).crystalsReward(600L)
                    .extractableSkillName("Проклятие Вечной Тьмы")
                    .droppedItemName("Корона Некромантии")
                    .dropRate(1.0)
                    .isBoss(true)
                    .elementalWeakness("HOLY")
                    .build();
            case 90 -> Monster.builder()
                    .name("Зегион (Король Насекомых Тумана)")
                    .species("Владыка Хитиновых Демонов")
                    .rank("Catastrophe")
                    .level(95)
                    .hp(75000).maxHp(75000).mp(50000)
                    .attack(3800).defense(3200).agility(2100).intelligence(2800)
                    .expReward(180000L).stellasReward(500000L).crystalsReward(1200L)
                    .extractableSkillName("Пространственный разрез Измерения")
                    .droppedItemName("Алмазный Панцирь Зегиона")
                    .dropRate(1.0)
                    .isBoss(true)
                    .build();
            default -> Monster.builder()
                    .name("Астральная Тень Дракона Бури Вельдоры")
                    .species("Истинный Дракон (Проекция)")
                    .rank("Catastrophe (Лорд Богов)")
                    .level(100)
                    .hp(150000).maxHp(150000).mp(100000)
                    .attack(6500).defense(5500).agility(3500).intelligence(5000)
                    .expReward(500000L).stellasReward(2000000L).crystalsReward(5000L)
                    .extractableSkillName("Вспышка Ревущей Бури Вельдоры")
                    .droppedItemName("Фрагмент Души Истинного Дракона")
                    .dropRate(1.0)
                    .isBoss(true)
                    .build();
        };
    }

    private Monster generateWildMonsterForFloor(int floor) {
        int lvl = Math.max(1, floor);
        int hp = 80 + (lvl * 35);
        int atk = 15 + (lvl * 6);
        int def = 12 + (lvl * 5);
        int agi = 10 + (lvl * 4);
        int intel = 8 + (lvl * 4);
        long exp = 35L + (lvl * 25L);
        long stellas = 50L + (lvl * 30L);

        String[] monsterNames = {
                "Пещерный Волк Джуры", "Кровожадная Летучая Мышь", "Гигантская Многоножка",
                "Черный Паук Бездны", "Пещерный Василиск", "Магический Голем Руды",
                "Теневой Леопард", "Искаженный Дух Лабиринта"
        };
        String name = monsterNames[random.nextInt(monsterNames.length)];

        String rank = (lvl < 15) ? "E" : (lvl < 35) ? "D" : (lvl < 55) ? "C" : (lvl < 75) ? "B" : "A";

        return Monster.builder()
                .name(name)
                .species("Зверь Лабиринта")
                .rank(rank)
                .level(lvl)
                .hp(hp).maxHp(hp).mp(hp * 2)
                .attack(atk).defense(def).agility(agi).intelligence(intel)
                .expReward(exp).stellasReward(stellas).crystalsReward((lvl > 20) ? 1L : 0L)
                .extractableSkillName("Теневой скачок")
                .droppedItemName("Магическая эссенция лабиринта")
                .dropRate(0.35)
                .build();
    }
}
