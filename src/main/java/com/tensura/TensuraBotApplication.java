package com.tensura;

import com.tensura.bot.SlimeTelegramBot;
import com.tensura.entity.Item;
import com.tensura.entity.Skill;
import com.tensura.repository.ItemRepository;
import com.tensura.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

import java.util.List;

@SpringBootApplication
@RequiredArgsConstructor
@Slf4j
public class TensuraBotApplication implements CommandLineRunner {

    private final SlimeTelegramBot slimeBot;
    private final ItemRepository itemRepository;
    private final SkillRepository skillRepository;

    public static void main(String[] args) {
        SpringApplication.run(TensuraBotApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("Seeding initial game world data for Tensura Slime RPG...");
        seedWorldTemplates();

        log.info("Registering SlimeTelegramBot with TelegramBotsApi...");
        try {
            TelegramBotsApi botsApi = new TelegramBotsApi(DefaultBotSession.class);
            botsApi.registerBot(slimeBot);
            log.info("=================================================");
            log.info(">>> TENSURA SLIME RPG BOT УСПЕШНО ЗАПУЩЕН!    <<<");
            log.info(">>> СЛУШАЕТ СООБЩЕНИЯ И ГОТОВ К ПРИКЛЮЧЕНИЯМ! <<<");
            log.info("=================================================");
        } catch (Exception e) {
            log.error("Failed to register Telegram Bot session: {}", e.getMessage(), e);
        }
    }

    private void seedWorldTemplates() {
        
        if (skillRepository.count() == 0) {
            Skill sage = Skill.builder()
                    .name("Великий Мудрец")
                    .japaneseName("大賢者 (グレートセージ)")
                    .skillType("UNIQUE")
                    .description("Встроенный советник: спектральный анализ цели, тактические прогнозы и параллельное мышление.")
                    .mpCost(15)
                    .cooldownTurns(0)
                    .powerMultiplier(1.0)
                    .effectType("ANALYZE")
                    .baseValue(0)
                    .build();

            Skill predator = Skill.builder()
                    .name("Хищник")
                    .japaneseName("捕食者 (プレデター)")
                    .skillType("UNIQUE")
                    .description("Поглощает плоть и душу противника, запечатывая в пространственном изолированном «Желудке».")
                    .mpCost(30)
                    .cooldownTurns(2)
                    .powerMultiplier(2.2)
                    .effectType("DEVOUR")
                    .baseValue(100)
                    .build();

            Skill waterBlade = Skill.builder()
                    .name("Водяные лезвия")
                    .japaneseName("水刃 (Suijin)")
                    .skillType("COMBAT")
                    .description("Тончайшие струи воды под сверхвысоким давлением, режущие броню.")
                    .mpCost(25)
                    .cooldownTurns(1)
                    .powerMultiplier(1.6)
                    .effectType("DAMAGE")
                    .baseValue(60)
                    .build();

            Skill barrier = Skill.builder()
                    .name("Барьер искажения")
                    .japaneseName("歪曲結界")
                    .skillType("COMBAT")
                    .description("Искажает локальное пространство, нейтрализуя входящий физический и магический урон.")
                    .mpCost(35)
                    .cooldownTurns(3)
                    .powerMultiplier(1.8)
                    .effectType("SHIELD")
                    .baseValue(150)
                    .build();

            Skill blackFlame = Skill.builder()
                    .name("Черное пламя (Black Flame)")
                    .japaneseName("黒炎 (Kokuen)")
                    .skillType("COMBAT")
                    .description("Неугасающее инфернальное пламя, сжигающее магическую сущность монстров.")
                    .mpCost(55)
                    .cooldownTurns(2)
                    .powerMultiplier(2.5)
                    .effectType("DAMAGE")
                    .baseValue(180)
                    .build();

            Skill regen = Skill.builder()
                    .name("Сверхбыстрая регенерация")
                    .japaneseName("超速再生")
                    .skillType("COMBAT")
                    .description("Мгновенное восстановление клеточной структуры слизи.")
                    .mpCost(40)
                    .cooldownTurns(2)
                    .powerMultiplier(2.0)
                    .effectType("HEAL")
                    .baseValue(200)
                    .build();

            skillRepository.saveAll(List.of(sage, predator, waterBlade, barrier, blackFlame, regen));
            log.info("Seeded [{}] skills", skillRepository.count());
        }

        if (itemRepository.findByPlayerTelegramIdIsNull().isEmpty()) {
            Item sword1 = Item.builder()
                    .name("Меч из Магической Стали Куробе")
                    .itemType("WEAPON")
                    .rarity("RARE")
                    .description("Клинок, выкованный главным кузнецом Темпеста из обогащенной магикулами стали Джуры.")
                    .attackBonus(35)
                    .defenseBonus(5)
                    .priceStellas(1500L)
                    .priceCrystals(10L)
                    .requiredForgeLevel(1)
                    .requiredOre(60)
                    .requiredTimber(40)
                    .build();

            Item sword2 = Item.builder()
                    .name("Клинок Пламени Ифрита")
                    .itemType("WEAPON")
                    .rarity("EPIC")
                    .description("Оружие, закаленное в первородном пламени Высшего Духа Огня.")
                    .attackBonus(90)
                    .defenseBonus(15)
                    .priceStellas(6000L)
                    .priceCrystals(35L)
                    .requiredForgeLevel(2)
                    .requiredOre(150)
                    .requiredTimber(90)
                    .build();

            Item armor1 = Item.builder()
                    .name("Доспех из Чешуи Буревого Змея")
                    .itemType("ARMOR")
                    .rarity("RARE")
                    .description("Легкая и прочная кольчуга из чешуи змеи, обитающей в Пещере Запечатывания.")
                    .attackBonus(0)
                    .defenseBonus(40)
                    .hpBonus(150)
                    .priceStellas(1800L)
                    .priceCrystals(12L)
                    .requiredForgeLevel(1)
                    .requiredOre(70)
                    .requiredTimber(50)
                    .build();

            Item armor2 = Item.builder()
                    .name("Панцирь Владыки Хаоса")
                    .itemType("ARMOR")
                    .rarity("LEGENDARY")
                    .description("Тяжелые латы, поглощающие кинетическую и магическую энергию ударов.")
                    .attackBonus(20)
                    .defenseBonus(120)
                    .hpBonus(500)
                    .priceStellas(18000L)
                    .priceCrystals(100L)
                    .requiredForgeLevel(3)
                    .requiredOre(300)
                    .requiredTimber(200)
                    .build();

            Item ring1 = Item.builder()
                    .name("Кольцо Пространственной Связи")
                    .itemType("ACCESSORY")
                    .rarity("EPIC")
                    .description("Артефакт, усиливающий поток магикул и связь с Коридором Душ.")
                    .attackBonus(15)
                    .defenseBonus(15)
                    .mpBonus(350)
                    .priceStellas(4500L)
                    .priceCrystals(25L)
                    .requiredForgeLevel(2)
                    .requiredOre(90)
                    .requiredTimber(60)
                    .build();

            Item potion = Item.builder()
                    .name("Зелье полного восстановления Джуры")
                    .itemType("POTION")
                    .rarity("RARE")
                    .description("Эликсир высокой чистоты, сваренный в лаборатории на основе целебных трав и воды Вельдоры.")
                    .hpBonus(350)
                    .mpBonus(200)
                    .priceStellas(200L)
                    .priceCrystals(5L)
                    .consumable(true)
                    .usableInBattle(true)
                    .build();

            itemRepository.saveAll(List.of(sword1, sword2, armor1, armor2, ring1, potion));
            log.info("Seeded catalog items successfully.");
        }
    }
}
