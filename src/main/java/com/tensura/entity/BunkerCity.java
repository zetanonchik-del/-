package com.tensura.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "bunker_cities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BunkerCity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long playerTelegramId;

    @Column(nullable = false)
    @Builder.Default
    private String cityName = "Федерация Джура Темпест";

    // --- City Level & Population ---
    @Column(nullable = false)
    @Builder.Default
    private int cityLevel = 1;

    @Column(nullable = false)
    @Builder.Default
    private int population = 50;

    @Column(nullable = false)
    @Builder.Default
    private int assignedWorkers = 10;

    // --- Building Levels ---
    @Column(nullable = false)
    @Builder.Default
    private int blacksmithLevel = 1; // Кузница Куробе (crafting weapon/armor)

    @Column(nullable = false)
    @Builder.Default
    private int labLevel = 1; // Лаборатория Бальмунда (potions/magicule extraction)

    @Column(nullable = false)
    @Builder.Default
    private int tavernLevel = 1; // Трактир Ригурда (morale, casino, quests)

    @Column(nullable = false)
    @Builder.Default
    private int farmLevel = 1; // Фермы гоблинов (food, population growth)

    @Column(nullable = false)
    @Builder.Default
    private int barrierLevel = 1; // Защитный барьер Джуры (defense from monster waves)

    // --- Resources Storage ---
    @Column(nullable = false)
    @Builder.Default
    private long magicOre = 100L; // Магическая руда

    @Column(nullable = false)
    @Builder.Default
    private long juraTimber = 200L; // Древесина Джунглей Джуры

    @Column(nullable = false)
    @Builder.Default
    private long magicWater = 50L; // Магическая вода (из пещеры Вельдоры)

    @Column(nullable = false)
    @Builder.Default
    private long healingPotions = 5L; // Зелья восстановления

    @Column(nullable = false)
    @Builder.Default
    private long uncollectedStellas = 0L; // Накопленные налоги

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime lastResourceCollection = LocalDateTime.now();

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // --- Resource Generation Formulas ---

    public void collectPassiveResources() {
        LocalDateTime now = LocalDateTime.now();
        long minutesPassed = java.time.Duration.between(this.lastResourceCollection, now).toMinutes();
        if (minutesPassed < 5) {
            return; // Min 5 min interval to accumulate
        }

        double hours = minutesPassed / 60.0;
        if (hours > 24.0) {
            hours = 24.0; // Max 24 hours cap
        }

        long earnedOre = (long) Math.round(hours * (10 + (this.blacksmithLevel * 15) + (this.assignedWorkers * 2)));
        long earnedTimber = (long) Math.round(hours * (20 + (this.farmLevel * 25) + (this.assignedWorkers * 3)));
        long earnedWater = (long) Math.round(hours * (5 + (this.labLevel * 8)));
        long earnedStellas = (long) Math.round(hours * (50 + (this.tavernLevel * 60) + (this.population * 2)));

        this.magicOre += earnedOre;
        this.juraTimber += earnedTimber;
        this.magicWater += earnedWater;
        this.uncollectedStellas += earnedStellas;

        this.lastResourceCollection = now;
    }

    public boolean canUpgradeBuilding(String buildingType, long playerStellas) {
        int targetLevel = getBuildingLevel(buildingType);
        long requiredStellas = (targetLevel + 1) * 600L;
        long requiredTimber = (targetLevel + 1) * 150L;
        long requiredOre = (targetLevel + 1) * 80L;

        return playerStellas >= requiredStellas &&
                this.juraTimber >= requiredTimber &&
                this.magicOre >= requiredOre;
    }

    public int getBuildingLevel(String buildingType) {
        return switch (buildingType.toUpperCase()) {
            case "BLACKSMITH" -> this.blacksmithLevel;
            case "LAB" -> this.labLevel;
            case "TAVERN" -> this.tavernLevel;
            case "FARM" -> this.farmLevel;
            case "BARRIER" -> this.barrierLevel;
            default -> 1;
        };
    }
}
