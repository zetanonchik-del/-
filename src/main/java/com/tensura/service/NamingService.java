package com.tensura.service;

import com.tensura.config.GameBalanceConfig;
import com.tensura.entity.Player;
import com.tensura.entity.Subordinate;
import com.tensura.repository.PlayerRepository;
import com.tensura.repository.SubordinateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class NamingService {

    private final SubordinateRepository subordinateRepository;
    private final PlayerRepository playerRepository;
    private final Random random = new Random();

    public static class NamingCandidate {
        public String baseSpecies;
        public String evolvedSpecies;
        public String defaultName;
        public int requiredMp;
        public String expectedRank;
        public int expectedPower;
    }

    public static class NamingResult {
        public boolean success;
        public Subordinate subordinate;
        public boolean enteredComa;
        public int comaMinutes;
        public String message;
    }

    public List<NamingCandidate> getAvailableCandidates() {
        NamingCandidate c1 = new NamingCandidate();
        c1.baseSpecies = "Гоблин (Goblin)";
        c1.evolvedSpecies = "Хофгоблин (Hobgoblin)";
        c1.defaultName = "Ригурд";
        c1.requiredMp = GameBalanceConfig.NAMING_GOBLIN_COST_MP;
        c1.expectedRank = "C";
        c1.expectedPower = 280;

        NamingCandidate c2 = new NamingCandidate();
        c2.baseSpecies = "Огр (Ogre)";
        c2.evolvedSpecies = "Киджин (Kijin) / Они";
        c2.defaultName = "Бенимару";
        c2.requiredMp = GameBalanceConfig.NAMING_OGRE_COST_MP;
        c2.expectedRank = "A";
        c2.expectedPower = 1850;

        NamingCandidate c3 = new NamingCandidate();
        c3.baseSpecies = "Людоящер (Lizardman)";
        c3.evolvedSpecies = "Драконид (Dragonewt)";
        c3.defaultName = "Габил";
        c3.requiredMp = GameBalanceConfig.NAMING_LIZARDMAN_COST_MP;
        c3.expectedRank = "B";
        c3.expectedPower = 850;

        NamingCandidate c4 = new NamingCandidate();
        c4.baseSpecies = "Орк (Orc)";
        c4.evolvedSpecies = "Верховный Орк (High Orc)";
        c4.defaultName = "Гельд";
        c4.requiredMp = GameBalanceConfig.NAMING_ORC_COST_MP;
        c4.expectedRank = "B+";
        c4.expectedPower = 1100;

        return List.of(c1, c2, c3, c4);
    }

    @Transactional
    public NamingResult bestowName(Player player, String baseSpecies, String customName) {
        log.info("Player [{}] naming monster species [{}] as [{}]", player.getTelegramId(), baseSpecies, customName);

        NamingResult result = new NamingResult();

        NamingCandidate candidate = getAvailableCandidates().stream()
                .filter(c -> c.baseSpecies.toLowerCase().contains(baseSpecies.toLowerCase()) ||
                        baseSpecies.toLowerCase().contains(c.baseSpecies.toLowerCase()))
                .findFirst()
                .orElse(null);

        if (candidate == null) {
            result.success = false;
            result.message = "❌ Вид монстра не опознан в окрестностях Темпеста!";
            return result;
        }

        if (player.getMp() < candidate.requiredMp) {
            result.success = false;
            result.message = String.format("⚠️ <b>Недостаточно магикул!</b>\nТребуется: <b>%d MP</b>\nВаш текущий запас: <b>%d MP</b>\n<i>«Великий Мудрец»: Попытка наречения именем при таком дефиците приведет к аннигиляции ядра души!</i>",
                    candidate.requiredMp, player.getMp());
            return result;
        }

        player.setMp(player.getMp() - candidate.requiredMp);

        double remainingRatio = (double) player.getMp() / Math.max(1, player.getMaxMp());
        boolean wentToComa = false;
        int comaMin = 0;

        if (remainingRatio < 0.20 && random.nextDouble() < GameBalanceConfig.NAMING_MAGICULE_DRAIN_RISK) {
            wentToComa = true;
            comaMin = 3 + random.nextInt(5);
            player.setInComa(true);
            player.setComaUntil(LocalDateTime.now().plusMinutes(comaMin));
            log.warn("Player [{}] entered magicule coma for [{}] minutes after naming", player.getTelegramId(), comaMin);
        }

        Subordinate subordinate = Subordinate.builder()
                .masterTelegramId(player.getTelegramId())
                .customName(customName.trim())
                .baseSpecies(candidate.baseSpecies)
                .evolvedSpecies(candidate.evolvedSpecies)
                .rank(candidate.expectedRank)
                .level(1)
                .combatPower(candidate.expectedPower)
                .loyalty(100)
                .magiculesInvested(candidate.requiredMp)
                .assignedDuty("GUARD")
                .inCombatSquad(false)
                .namedAt(LocalDateTime.now())
                .build();

        Subordinate saved = subordinateRepository.save(subordinate);
        playerRepository.save(player);

        result.success = true;
        result.subordinate = saved;
        result.enteredComa = wentToComa;
        result.comaMinutes = comaMin;

        StringBuilder sb = new StringBuilder();
        sb.append("✨ <b>ТАИНСТВО НАРЕЧЕНИЯ ИМЕНЕМ СОСТОЯЛОСЬ!</b>\n\n");
        sb.append("<i>«Голос Мира: Подтверждение связи души. Затрачено магикул: ").append(candidate.requiredMp).append(" MP.\n");
        sb.append("Существо [").append(candidate.baseSpecies).append("] обрело имя: <b>").append(customName).append("</b>!\n");
        sb.append("Произошла мутация генокода. Новая раса: <b>").append(candidate.evolvedSpecies).append("</b> (Ранг ").append(candidate.expectedRank).append(").»</i>\n\n");
        sb.append("⚔️ Боевая мощь соратника: <b>").append(candidate.expectedPower).append("</b>\n");
        sb.append("🤝 Лояльность: <b>100% (Абсолютная преданность Владыке)</b>\n");

        if (wentToComa) {
            sb.append("\n💤 <b>ВНИМАНИЕ: МАГИЧЕСКИЙ АНАБИОЗ!</b>\n");
            sb.append("<i>«Из-за резкого оттока магикул ваше тело погрузилось в сон на ").append(comaMin).append(" мин. для восстановления плотности ауры.»</i>\n");
        }

        result.message = sb.toString();
        return result;
    }
}
