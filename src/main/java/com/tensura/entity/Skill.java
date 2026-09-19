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
    private String name; 

    @Column(nullable = false)
    private String japaneseName; 

    @Column(nullable = false)
    private String skillType; 

    @Column(length = 1000, nullable = false)
    private String description;

    @Column(nullable = false)
    private int mpCost; 

    @Column(nullable = false)
    private int cooldownTurns;

    @Column(nullable = false)
    private double powerMultiplier; 

    @Column(nullable = false)
    private String effectType; 

    @Column(nullable = false)
    private int baseValue; 

    @Column(nullable = false)
    @Builder.Default
    private int masteryLevel = 1; 

    @Column(nullable = false)
    @Builder.Default
    private int masteryExp = 0; 

    @Column(nullable = false)
    @Builder.Default
    private boolean isUltimate = false; 

    public int calculateEffectivePower(int playerIntelligence, int playerAttack) {
        double statContribution = (playerAttack * 0.4) + (playerIntelligence * 0.6);
        double masteryBonus = 1.0 + (this.masteryLevel * 0.08);
        return (int) Math.round((this.baseValue + (statContribution * this.powerMultiplier)) * masteryBonus);
    }
}
