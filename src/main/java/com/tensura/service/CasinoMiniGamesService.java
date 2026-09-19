package com.tensura.service;

import com.tensura.entity.Player;
import com.tensura.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class CasinoMiniGamesService {

    private final PlayerRepository playerRepository;
    private final Random random = new Random();

    public static class CasinoGameResult {
        public boolean won;
        public long bet;
        public long payout;
        public long netGain;
        public String title;
        public String details;
    }

    @Transactional
    public CasinoGameResult playGoblinDice(Player player, long bet) {
        log.info("Player [{}] playing Goblin Dice with bet [{}]", player.getTelegramId(), bet);

        CasinoGameResult res = new CasinoGameResult();
        res.title = "🎲 <b>КОСТИ ГОБЛИНОВ В ТРАКТИРЕ РИГУРДА</b>";
        res.bet = bet;

        if (player.getStellas() < bet || bet <= 0) {
            res.won = false;
            res.details = "❌ Недостаточно Стелл для совершения ставки!";
            return res;
        }

        player.setStellas(player.getStellas() - bet);

        int p1 = 1 + random.nextInt(6);
        int p2 = 1 + random.nextInt(6);
        int playerTotal = p1 + p2;

        int o1 = 1 + random.nextInt(6);
        int o2 = 1 + random.nextInt(6);
        int opponentTotal = o1 + o2;

        StringBuilder sb = new StringBuilder();
        sb.append("Вы бросаете кости: [").append(p1).append("] + [").append(p2).append("] = <b>").append(playerTotal).append("</b>\n");
        sb.append("Гобута бросает кости: [").append(o1).append("] + [").append(o2).append("] = <b>").append(opponentTotal).append("</b>\n\n");

        if (playerTotal > opponentTotal) {
            long winAmount = (long) (bet * 2.0);
            player.setStellas(player.getStellas() + winAmount);
            res.won = true;
            res.payout = winAmount;
            res.netGain = bet;
            sb.append("🎉 <b>ВЫ ПОБЕДИЛИ!</b>\nГобута огорченно вздыхает и отдает вам выигрыш: <b>+").append(winAmount).append(" Стелл</b>!");
        } else if (playerTotal == opponentTotal) {
            player.setStellas(player.getStellas() + bet);
            res.won = false;
            res.payout = bet;
            res.netGain = 0;
            sb.append("⚖️ <b>НИЧЬЯ!</b> Очки равны. Ставка <b>").append(bet).append(" Стелл</b> возвращена.");
        } else {
            res.won = false;
            res.payout = 0;
            res.netGain = -bet;
            sb.append("💀 <b>ВЫ ПРОИГРАЛИ!</b> Гобута счастливо забирает вашу ставку <b>").append(bet).append(" Стелл</b>!");
        }

        playerRepository.save(player);
        res.details = sb.toString();
        return res;
    }

    @Transactional
    public CasinoGameResult playTempestRoulette(Player player, long bet, String betType) {
        log.info("Player [{}] playing Tempest Roulette with bet [{}], type [{}]", player.getTelegramId(), bet, betType);

        CasinoGameResult res = new CasinoGameResult();
        res.title = "🎡 <b>МАГИЧЕСКАЯ РУЛЕТКА ТЕМПЕСТА</b>";
        res.bet = bet;

        if (player.getStellas() < bet || bet <= 0) {
            res.won = false;
            res.details = "❌ Недостаточно Стелл для совершения ставки!";
            return res;
        }

        player.setStellas(player.getStellas() - bet);

        int spinNumber = random.nextInt(37);
        String spinColor;
        if (spinNumber == 0) {
            spinColor = "GREEN"; 
        } else if (spinNumber % 2 == 1) {
            spinColor = "RED"; 
        } else {
            spinColor = "BLACK"; 
        }

        boolean won = false;
        double multiplier = 0.0;

        switch (betType.toUpperCase()) {
            case "RED" -> {
                if ("RED".equals(spinColor)) {
                    won = true;
                    multiplier = 2.0;
                }
            }
            case "BLACK" -> {
                if ("BLACK".equals(spinColor)) {
                    won = true;
                    multiplier = 2.0;
                }
            }
            case "GREEN" -> {
                if ("GREEN".equals(spinColor)) {
                    won = true;
                    multiplier = 14.0;
                }
            }
            case "EVEN" -> {
                if (spinNumber > 0 && spinNumber % 2 == 0) {
                    won = true;
                    multiplier = 2.0;
                }
            }
            case "ODD" -> {
                if (spinNumber % 2 == 1) {
                    won = true;
                    multiplier = 2.0;
                }
            }
        }

        StringBuilder sb = new StringBuilder();
        String colorBadge = switch (spinColor) {
            case "RED" -> "🔴 Красный (Пламя Ифрита)";
            case "BLACK" -> "⚫ Черный (Буря Вельдоры)";
            default -> "🟢 Зеро (Магия Рамирис)";
        };

        sb.append("Шарик остановился на: [<b>").append(spinNumber).append("</b>] ").append(colorBadge).append("!\n\n");

        if (won) {
            long winAmount = (long) (bet * multiplier);
            player.setStellas(player.getStellas() + winAmount);
            res.won = true;
            res.payout = winAmount;
            res.netGain = winAmount - bet;
            sb.append("🌟 <b>БЛЕСТЯЩИЙ ВЫИГРЫШ!</b>\nМьельмиль торжественно вручает вам куш: <b>+")
                    .append(winAmount).append(" Стелл</b> (x").append(multiplier).append(")");
        } else {
            res.won = false;
            res.payout = 0;
            res.netGain = -bet;
            sb.append("💸 <b>СТАВКА СГОРЕЛА!</b> Вы потеряли <b>").append(bet).append(" Стелл</b>.");
        }

        playerRepository.save(player);
        res.details = sb.toString();
        return res;
    }

    @Transactional
    public CasinoGameResult playCardDuel(Player player, long bet) {
        CasinoGameResult res = new CasinoGameResult();
        res.title = "🃏 <b>КАРТОЧНАЯ ДУЭЛЬ С РИГУРДОМ</b>";
        res.bet = bet;

        if (player.getStellas() < bet || bet <= 0) {
            res.won = false;
            res.details = "❌ Недостаточно Стелл для совершения ставки!";
            return res;
        }

        player.setStellas(player.getStellas() - bet);

        String[] cardNames = {"2", "3", "4", "5", "6", "7", "8", "9", "10", "Валет", "Дама", "Король", "Туз"};
        int playerCardIdx = random.nextInt(13);
        int dealerCardIdx = random.nextInt(13);

        StringBuilder sb = new StringBuilder();
        sb.append("Ваша карта: <b>[").append(cardNames[playerCardIdx]).append("]</b>\n");
        sb.append("Карта Ригурда: <b>[").append(cardNames[dealerCardIdx]).append("]</b>\n\n");

        if (playerCardIdx > dealerCardIdx) {
            long winAmount = (long) (bet * 2.0);
            player.setStellas(player.getStellas() + winAmount);
            res.won = true;
            res.payout = winAmount;
            res.netGain = bet;
            sb.append("🏆 <b>ПОБЕДА В ДУЭЛИ!</b> Ваша карта старше! Получено: <b>+").append(winAmount).append(" Стелл</b>.");
        } else if (playerCardIdx == dealerCardIdx) {
            player.setStellas(player.getStellas() + bet);
            res.won = false;
            res.payout = bet;
            res.netGain = 0;
            sb.append("🤝 <b>РАВНЫЙ РАНГ КАРТ!</b> Возврат ставки <b>").append(bet).append(" Стелл</b>.");
        } else {
            res.won = false;
            res.payout = 0;
            res.netGain = -bet;
            sb.append("💔 <b>КАРТА РИГУРДА СИЛЬНЕЕ!</b> Ставка <b>").append(bet).append(" Стелл</b> уходит в банк.");
        }

        playerRepository.save(player);
        res.details = sb.toString();
        return res;
    }
}
