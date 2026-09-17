package com.tensura.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "player_skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long playerTelegramId;

    @Column(nullable = false)
    private String skillName;

    @Column(nullable = false)
    private String japaneseName;

    @Column(nullable = false)
    private String skillType;

    @Column(length = 1000, nullable = false)
    private String description;

    @Column(nullable = false)
    private int mpCost;

    @Column(nullable = false)
    private double powerMultiplier;

    @Column(nullable = false)
    private String effectType; // DAMAGE, HEAL, SHIELD, DEVOUR, ANALYZE

    @Column(nullable = false)
    @Builder.Default
    private int masteryLevel = 1;

    @Column(nullable = false)
    @Builder.Default
    private int masteryExp = 0;

    @Column(nullable = false)
    @Builder.Default
    private boolean equipped = true;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime acquiredAt = LocalDateTime.now();

    public void addMasteryExp(int amount) {
        this.masteryExp += amount;
        int expNeeded = this.masteryLevel * 20;
        if (this.masteryExp >= expNeeded) {
            this.masteryExp -= expNeeded;
            this.masteryLevel++;
            this.powerMultiplier += 0.15;
        }
    }
}
