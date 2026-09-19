package com.tensura.entity;

import com.tensura.config.GameBalanceConfig;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "players")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long telegramId;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false)
    @Builder.Default
    private String race = "Слизь (Slime)";

    @Column(nullable = false)
    @Builder.Default
    private String rank = "F (Низший монстр)";

    @Column(nullable = false)
    @Builder.Default
    private int evolutionStage = 1; 

    @Column(nullable = false)
    @Builder.Default
    private int level = 1;

    @Column(nullable = false)
    @Builder.Default
    private long exp = 0L;

    @Column(nullable = false)
    @Builder.Default
    private long maxExp = 100L;

    @Column(nullable = false)
    @Builder.Default
    private long collectedSouls = 0L; 

    @Column(nullable = false)
    @Builder.Default
    private int hp = GameBalanceConfig.BASE_SLIME_HP;

    @Column(nullable = false)
    @Builder.Default
    private int maxHp = GameBalanceConfig.BASE_SLIME_HP;

    @Column(nullable = false)
    @Builder.Default
    private int mp = GameBalanceConfig.BASE_SLIME_MP; 

    @Column(nullable = false)
    @Builder.Default
    private int maxMp = GameBalanceConfig.BASE_SLIME_MP;

    @Column(nullable = false)
    @Builder.Default
    private int attack = GameBalanceConfig.BASE_SLIME_ATK;

    @Column(nullable = false)
    @Builder.Default
    private int defense = GameBalanceConfig.BASE_SLIME_DEF;

    @Column(nullable = false)
    @Builder.Default
    private int agility = GameBalanceConfig.BASE_SLIME_AGI;

    @Column(nullable = false)
    @Builder.Default
    private int intelligence = GameBalanceConfig.BASE_SLIME_INT;

    @Column(nullable = false)
    @Builder.Default
    private int stamina = GameBalanceConfig.BASE_MAX_STAMINA;

    @Column(nullable = false)
    @Builder.Default
    private int maxStamina = GameBalanceConfig.BASE_MAX_STAMINA;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime lastStaminaUpdate = LocalDateTime.now();

    @Column(nullable = false)
    @Builder.Default
    private int currentLabyrinthFloor = 1;

    @Column(nullable = false)
    @Builder.Default
    private int highestLabyrinthFloor = 1;

    @Column(nullable = false)
    @Builder.Default
    private long stellas = GameBalanceConfig.STARTING_STELLAS; 

    @Column(nullable = false)
    @Builder.Default
    private long magicCrystals = GameBalanceConfig.STARTING_CRYSTALS;

    @Column(nullable = false)
    @Builder.Default
    private long reputation = 0L;

    private Long equippedWeaponId;
    private Long equippedArmorId;
    private Long equippedAccessoryId;

    @Column(nullable = false)
    @Builder.Default
    private boolean inBattle = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean inComa = false; 

    private LocalDateTime comaUntil;

    @Column(nullable = false)
    @Builder.Default
    private String activeTitle = "Одинокая Слизь из Пещеры Запечатывания";

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    public void restoreFullHealth() {
        this.hp = this.maxHp;
        this.mp = this.maxMp;
    }

    public void gainExp(long amount) {
        this.exp += amount;
        while (this.exp >= this.maxExp) {
            this.exp -= this.maxExp;
            levelUp();
        }
        this.updatedAt = LocalDateTime.now();
    }

    private void levelUp() {
        this.level++;
        int hpBonus = 25 + (int) (this.level * 4.5);
        int mpBonus = 60 + (int) (this.level * 10.0);
        int atkBonus = 5 + (int) (this.level * 1.2);
        int defBonus = 4 + (int) (this.level * 1.1);
        int agiBonus = 3 + (int) (this.level * 0.8);
        int intBonus = 6 + (int) (this.level * 1.5);

        this.maxHp += hpBonus;
        this.maxMp += mpBonus;
        this.attack += atkBonus;
        this.defense += defBonus;
        this.agility += agiBonus;
        this.intelligence += intBonus;

        this.hp = this.maxHp;
        this.mp = this.maxMp;
        this.maxExp = GameBalanceConfig.calculateRequiredExp(this.level);
    }

    public void updateStamina() {
        LocalDateTime now = LocalDateTime.now();
        if (this.stamina < this.maxStamina) {
            long minutesPassed = java.time.Duration.between(this.lastStaminaUpdate, now).toMinutes();
            int pointsToRecover = (int) (minutesPassed / GameBalanceConfig.STAMINA_RECOVERY_MINUTES);
            if (pointsToRecover > 0) {
                this.stamina = Math.min(this.maxStamina, this.stamina + pointsToRecover);
                this.lastStaminaUpdate = now;
            }
        } else {
            this.lastStaminaUpdate = now;
        }
    }

    public boolean consumeStamina(int amount) {
        updateStamina();
        if (this.stamina >= amount) {
            this.stamina -= amount;
            this.lastStaminaUpdate = LocalDateTime.now();
            return true;
        }
        return false;
    }

    public boolean consumeMp(int amount) {
        if (this.mp >= amount) {
            this.mp -= amount;
            return true;
        }
        return false;
    }

    public void takeDamage(int amount) {
        this.hp = Math.max(0, this.hp - amount);
    }

    public void heal(int amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }

    public void restoreMp(int amount) {
        this.mp = Math.min(this.maxMp, this.mp + amount);
    }

    public boolean isAlive() {
        return this.hp > 0;
    }
}
