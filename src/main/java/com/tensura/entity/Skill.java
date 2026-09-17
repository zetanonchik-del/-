package com.tensura.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // e.g. "Черное пламя (Black Flame)"

    @Column(nullable = false)
    private String japaneseName; // e.g. "黒炎 (Kokuen)"

    @Column(nullable = false)
    private String skillType; // INTRINSIC, UNIQUE, ULTIMATE, COMBAT, RESISTANCE

    @Column(length = 1000, nullable = false)
    private String description;

    @Column(nullable = false)
    private int mpCost; // Magicules cost

    @Column(nullable = false)
    private int cooldownTurns;

    @Column(nullable = false)
    private double powerMultiplier; // Multiplier for attack or effect

    @Column(nullable = false)
    private String effectType; // DAMAGE, HEAL, SHIELD, DEVOUR, ANALYZE, BUFF, DEBUFF

    @Column(nullable = false)
    private int baseValue; // Flat base value

    @Column(nullable = false)
    @Builder.Default
    private int masteryLevel = 1; // Level of mastery for player

    @Column(nullable = false)
    @Builder.Default
    private int masteryExp = 0; // Usage count towards next level

    @Column(nullable = false)
    @Builder.Default
    private boolean isUltimate = false; // Ultimate skill indicator

    // --- Dynamic execution helper ---
    public int calculateEffectivePower(int playerIntelligence, int playerAttack) {
        double statContribution = (playerAttack * 0.4) + (playerIntelligence * 0.6);
        double masteryBonus = 1.0 + (this.masteryLevel * 0.08);
        return (int) Math.round((this.baseValue + (statContribution * this.powerMultiplier)) * masteryBonus);
    }
}
