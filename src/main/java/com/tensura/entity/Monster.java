package com.tensura.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "monsters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Monster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String species;

    @Column(nullable = false)
    private String rank; 

    @Column(nullable = false)
    private int level;

    @Column(nullable = false)
    private int hp;

    @Column(nullable = false)
    private int maxHp;

    @Column(nullable = false)
    private int mp;

    @Column(nullable = false)
    private int attack;

    @Column(nullable = false)
    private int defense;

    @Column(nullable = false)
    private int agility;

    @Column(nullable = false)
    private int intelligence;

    @Column(nullable = false)
    private long expReward;

    @Column(nullable = false)
    private long stellasReward;

    @Column(nullable = false)
    private long crystalsReward;

    private String extractableSkillName;
    private int extractableAtkBonus;
    private int extractableDefBonus;
    private int extractableHpBonus;
    private int extractableMpBonus;

    private String droppedItemName;
    private double dropRate; 

    @Builder.Default
    private boolean isBoss = false;

    @Builder.Default
    private boolean isRaidTarget = false;

    private String elementalWeakness; 
    private String elementalResistance; 

    @Column(length = 1000)
    private String description;

    public Monster createCombatInstance(int levelMultiplier) {
        double mult = 1.0 + (levelMultiplier * 0.12);
        int scaledHp = (int) Math.round(this.maxHp * mult);
        int scaledAtk = (int) Math.round(this.attack * mult);
        int scaledDef = (int) Math.round(this.defense * mult);
        int scaledAgi = (int) Math.round(this.agility * mult);
        int scaledInt = (int) Math.round(this.intelligence * mult);

        return Monster.builder()
                .name(this.name)
                .title(this.title)
                .species(this.species)
                .rank(this.rank)
                .level(this.level + levelMultiplier)
                .hp(scaledHp)
                .maxHp(scaledHp)
                .mp((int) Math.round(this.mp * mult))
                .attack(scaledAtk)
                .defense(scaledDef)
                .agility(scaledAgi)
                .intelligence(scaledInt)
                .expReward((long) (this.expReward * mult))
                .stellasReward((long) (this.stellasReward * mult))
                .crystalsReward((long) (this.crystalsReward * (mult > 1.5 ? 2 : 1)))
                .extractableSkillName(this.extractableSkillName)
                .extractableAtkBonus(this.extractableAtkBonus)
                .extractableDefBonus(this.extractableDefBonus)
                .extractableHpBonus(this.extractableHpBonus)
                .extractableMpBonus(this.extractableMpBonus)
                .droppedItemName(this.droppedItemName)
                .dropRate(this.dropRate)
                .isBoss(this.isBoss)
                .isRaidTarget(this.isRaidTarget)
                .elementalWeakness(this.elementalWeakness)
                .elementalResistance(this.elementalResistance)
                .description(this.description)
                .build();
    }

    public void takeDamage(int amount) {
        this.hp = Math.max(0, this.hp - amount);
    }

    public boolean isAlive() {
        return this.hp > 0;
    }
}
