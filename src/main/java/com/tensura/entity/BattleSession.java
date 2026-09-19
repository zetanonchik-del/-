package com.tensura.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "battle_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BattleSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long playerTelegramId;

    @Column(nullable = false)
    private String monsterName;

    @Column(nullable = false)
    private String monsterRank;

    @Column(nullable = false)
    private String monsterSpecies;

    @Column(nullable = false)
    private int monsterHp;

    @Column(nullable = false)
    private int monsterMaxHp;

    @Column(nullable = false)
    private int monsterAttack;

    @Column(nullable = false)
    private int monsterDefense;

    @Column(nullable = false)
    private int monsterAgility;

    @Column(nullable = false)
    private long expReward;

    @Column(nullable = false)
    private long stellasReward;

    private String dropItemName;
    private double dropRate;
    private String extractableSkill;

    @Column(nullable = false)
    @Builder.Default
    private int round = 1;

    @Column(nullable = false)
    @Builder.Default
    private int barrierShield = 0; 

    @Column(nullable = false)
    @Builder.Default
    private String battleType = "WILDERNESS"; 

    @Column(nullable = false)
    @Builder.Default
    private int labyrinthFloor = 1;

    @Column(nullable = false)
    @Builder.Default
    private boolean finished = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean playerWon = false;

    @Column(length = 2500)
    private String combatLog;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime startedAt = LocalDateTime.now();

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    public void appendLog(String message) {
        if (this.combatLog == null || this.combatLog.isEmpty()) {
            this.combatLog = message;
        } else {
            this.combatLog = this.combatLog + "\n" + message;
        }
    }
}
