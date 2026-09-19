package com.tensura.service;

import com.tensura.entity.Item;
import com.tensura.entity.Player;
import com.tensura.repository.ItemRepository;
import com.tensura.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuctionAndTradeService {

    private final ItemRepository itemRepository;
    private final PlayerRepository playerRepository;
    private final GreatSageAdvisorService greatSageAdvisorService;
    private final Random random = new Random();

    public static class TradeResult {
        public boolean success;
        public String message;
        public long currentStellas;
    }

    public static class ArenaDuelResult {
        public boolean playerWon;
        public String opponentName;
        public long rewardStellas;
        public long rewardReputation;
        public String combatSummary;
    }

    public List<Item> getCaravanGoods() {
        return itemRepository.findByPlayerTelegramIdIsNull();
    }

    @Transactional
    public TradeResult buyCaravanItem(Player player, Long itemId) {
        TradeResult res = new TradeResult();
        Optional<Item> itemOpt = itemRepository.findById(itemId);

        if (itemOpt.isEmpty()) {
            res.success = false;
            res.message = "❌ Товар не найден в торговом караване!";
            return res;
        }

        Item template = itemOpt.get();
        if (player.getStellas() < template.getPriceStellas()) {
            res.success = false;
            res.message = String.format("❌ Недостаточно Стелл! Цена: <b>%d Стелл</b>, у вас: <b>%d</b>",
                    template.getPriceStellas(), player.getStellas());
            return res;
        }

        player.setStellas(player.getStellas() - template.getPriceStellas());
        playerRepository.save(player);

        Optional<Item> ownedOpt = itemRepository.findByNameAndPlayerTelegramId(template.getName(), player.getTelegramId());
        if (ownedOpt.isPresent()) {
            Item owned = ownedOpt.get();
            owned.setQuantity(owned.getQuantity() + 1);
            itemRepository.save(owned);
        } else {
            Item newItem = template.createPlayerCopy(player.getTelegramId(), 1);
            itemRepository.save(newItem);
        }

        res.success = true;
        res.currentStellas = player.getStellas();
        res.message = String.format(
                "🤝 <b>СДЕЛКА С КАРАВАНОМ ЗАКЛЮЧЕНА!</b>\n\n" +
                        "Вы приобрели: <b>%s</b> [%s]\n" +
                        "• Списано: <b>%d Стелл</b>\n" +
                        "• Текущий баланс: <b>%d Стелл</b>\n" +
                        "<i>Товар успешно передан в ваш инвентарь.</i>",
                template.getName(), template.getRarity(),
                template.getPriceStellas(), player.getStellas()
        );
        return res;
    }

    @Transactional
    public TradeResult sellItem(Player player, Long inventoryItemId) {
        TradeResult res = new TradeResult();
        Optional<Item> itemOpt = itemRepository.findByIdAndPlayerTelegramId(inventoryItemId, player.getTelegramId());

        if (itemOpt.isEmpty()) {
            res.success = false;
            res.message = "❌ Предмет не найден в вашем инвентаре!";
            return res;
        }

        Item item = itemOpt.get();
        if (item.isEquipped()) {
            res.success = false;
            res.message = "⚠️ Нельзя продать экипированный предмет! Сначала снимите его.";
            return res;
        }

        long sellPrice = Math.max(10L, (long) (item.getPriceStellas() * 0.60));
        player.setStellas(player.getStellas() + sellPrice);

        if (item.getQuantity() > 1) {
            item.setQuantity(item.getQuantity() - 1);
            itemRepository.save(item);
        } else {
            itemRepository.delete(item);
        }

        playerRepository.save(player);

        res.success = true;
        res.currentStellas = player.getStellas();
        res.message = String.format(
                "💰 <b>ПРЕДМЕТ ПРОДАН КАРАВАНУ!</b>\n\n" +
                        "Продано: <b>%s</b>\n" +
                        "• Выручка: <b>+%d Стелл</b>\n" +
                        "• Баланс: <b>%d Стелл</b>",
                item.getName(), sellPrice, player.getStellas()
        );
        return res;
    }

    @Transactional
    public ArenaDuelResult fightArenaDuel(Player player, String championName) {
        log.info("Player [{}] fighting Arena Duel vs [{}]", player.getTelegramId(), championName);

        ArenaDuelResult res = new ArenaDuelResult();
        res.opponentName = championName;

        int oppAtk;
        int oppDef;
        int oppHp;
        long rewardStellas;
        long rewardRep;

        switch (championName.toUpperCase()) {
            case "BENIMARU" -> {
                res.opponentName = "Бенимару (Командующий Темпеста)";
                oppAtk = 380;
                oppDef = 320;
                oppHp = 2500;
                rewardStellas = 5000L;
                rewardRep = 50L;
            }
            case "SHION" -> {
                res.opponentName = "Шион (Первый Телохранитель)";
                oppAtk = 450;
                oppDef = 280;
                oppHp = 2800;
                rewardStellas = 5500L;
                rewardRep = 60L;
            }
            case "SOUEI" -> {
                res.opponentName = "Соуэй (Глава Теневого Корпуса)";
                oppAtk = 340;
                oppDef = 260;
                oppHp = 2000;
                rewardStellas = 4500L;
                rewardRep = 45L;
            }
            default -> {
                res.opponentName = "Гобута (Капитан Волчьей Кавалерии)";
                oppAtk = 90;
                oppDef = 85;
                oppHp = 600;
                rewardStellas = 800L;
                rewardRep = 15L;
            }
        }

        double playerPower = greatSageAdvisorService.calculateCombatPower(player);
        double oppPower = (oppAtk * 3.0) + (oppDef * 2.2) + (oppHp * 0.4);

        double winProbability = playerPower / (playerPower + oppPower);
        boolean won = random.nextDouble() < winProbability;

        res.playerWon = won;
        StringBuilder sb = new StringBuilder();
        sb.append("🏟️ <b>АРЕНА КОЛИЗЕЯ ТЕМПЕСТА: ДУЭЛЬ</b>\n");
        sb.append("Ваш соперник: <b>").append(res.opponentName).append("</b>!\n\n");

        if (won) {
            res.rewardStellas = rewardStellas;
            res.rewardReputation = rewardRep;
            player.setStellas(player.getStellas() + rewardStellas);
            player.setReputation(player.getReputation() + rewardRep);
            playerRepository.save(player);

            sb.append("🎉 <b>БЛЕСТЯЩАЯ ПОБЕДА!</b>\n")
                    .append("Трибуны ревут от восторга! Вы одолели чемпиона на глазах у всех жителей Федерации!\n\n")
                    .append("• Награда: <b>+").append(rewardStellas).append(" Стелл</b>\n")
                    .append("• Репутация Темпеста: <b>+").append(rewardRep).append("</b> очков\n")
                    .append("<i>«Великий Мудрец»: Поединок зафиксирован в летописях Арены.</i>");
        } else {
            res.rewardStellas = 0;
            res.rewardReputation = 0;
            sb.append("💔 <b>ПОРАЖЕНИЕ В ДУЭЛИ!</b>\n")
                    .append("<b>").append(res.opponentName).append("</b> наносит решающий удар и побеждает в поединке.\n")
                    .append("<i>«Великий Мудрец»: Рекомендуется улучшить снаряжение в Кузнице Куробе и повысить уровень мастерства навыков.</i>");
        }

        res.combatSummary = sb.toString();
        return res;
    }
}
