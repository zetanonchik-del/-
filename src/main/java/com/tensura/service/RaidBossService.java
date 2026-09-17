package com.tensura.service;

import com.tensura.entity.Monster;
import com.tensura.entity.Player;
import com.tensura.repository.MonsterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RaidBossService {

    private final MonsterRepository monsterRepository;

    public List<Monster> getAvailableRaidBosses() {
        return List.of(
                Monster.builder()
                        .name("Ифрит (Дух Пламени Леона)")
                        .title("Владыка Первородного Огня")
                        .species("Высший Дух Огня")
                        .rank("Special A (Бедствие)")
                        .level(45)
                        .hp(7500).maxHp(7500).mp(8000)
                        .attack(420).defense(310).agility(260).intelligence(380)
                        .expReward(8500L).stellasReward(20000L).crystalsReward(50L)
                        .extractableSkillName("Черное пламя (Black Flame)")
                        .droppedItemName("Сердце Духа Огня")
                        .dropRate(1.0)
                        .isBoss(true)
                        .isRaidTarget(true)
                        .elementalWeakness("WATER")
                        .elementalResistance("FIRE")
                        .description("Пылающий колосс, заключенный в теле Сидзуэ Идзавы. Его пламя испепеляет саму материю.")
                        .build(),

                Monster.builder()
                        .name("Орк-Дикарь Гельд (Orc Disaster)")
                        .title("Повелитель Голода и Разрушения")
                        .species("Лорд Орков (Пробужденный)")
                        .rank("Disaster (Бедствие континента)")
                        .level(60)
                        .hp(16500).maxHp(16500).mp(9000)
                        .attack(780).defense(720).agility(280).intelligence(310)
                        .expReward(22000L).stellasReward(60000L).crystalsReward(150L)
                        .extractableSkillName("Голодный (Starved)")
                        .droppedItemName("Мясницкий Топор Орк-Дикаря")
                        .dropRate(1.0)
                        .isBoss(true)
                        .isRaidTarget(true)
                        .description("Предводитель 200-тысячной армии орков, движимый неутолимым чувством голода и проклятием.")
                        .build(),

                Monster.builder()
                        .name("Харибда (Небесное Бедствие)")
                        .title("Владыка Небес и Повелитель Мегалодонов")
                        .species("Мифический Левиафан")
                        .rank("Calamity (Катастрофа)")
                        .level(80)
                        .hp(42000).maxHp(42000).mp(35000)
                        .attack(1650).defense(1450).agility(750).intelligence(1100)
                        .expReward(75000L).stellasReward(250000L).crystalsReward(500L)
                        .extractableSkillName("Чешуйчатый барьер гравитации")
                        .droppedItemName("Глаз Харибды")
                        .dropRate(1.0)
                        .isBoss(true)
                        .isRaidTarget(true)
                        .elementalWeakness("HOLY")
                        .description("Древний парящий левиафан, рожденный из сгустка магикул Вельдоры. Призывает стаи летающих акул-мегалодонов.")
                        .build()
        );
    }

    public Optional<Monster> findRaidBossByName(String name) {
        return getAvailableRaidBosses().stream()
                .filter(b -> b.getName().equalsIgnoreCase(name) || b.getName().contains(name))
                .findFirst();
    }
}
