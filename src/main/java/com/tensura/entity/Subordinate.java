package com.tensura.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "subordinates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subordinate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long masterTelegramId;

    @Column(nullable = false)
    private String customName; 

    @Column(nullable = false)
    private String baseSpecies; 

    @Column(nullable = false)
    private String evolvedSpecies; 

    @Column(nullable = false)
    private String rank; 

    @Column(nullable = false)
    @Builder.Default
    private int level = 1;

    @Column(nullable = false)
    private int combatPower;

    @Column(nullable = false)
    @Builder.Default
    private int loyalty = 100; 

    @Column(nullable = false)
    private int magiculesInvested; 

    @Column(nullable = false)
    @Builder.Default
    private String assignedDuty = "GUARD"; 

    @Column(nullable = false)
    @Builder.Default
    private boolean inCombatSquad = false;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime namedAt = LocalDateTime.now();

    public void promoteLevel() {
        this.level++;
        this.combatPower += 35 + (this.level * 15);
        if (this.loyalty < 100) {
            this.loyalty = Math.min(100, this.loyalty + 5);
        }
    }
}
