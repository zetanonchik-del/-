package com.tensura.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // If null, it is a global catalog template; if set, it belongs to that player's inventory
    private Long playerTelegramId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String itemType; // WEAPON, ARMOR, ACCESSORY, POTION, MATERIAL, SOUL_CORE

    @Column(nullable = false)
    private String rarity; // COMMON, UNCOMMON, RARE, EPIC, LEGENDARY, MYTHIC, GENESIS

    @Column(length = 1000, nullable = false)
    private String description;

    // --- Stat Bonuses ---
    @Column(nullable = false)
    @Builder.Default
    private int attackBonus = 0;

    @Column(nullable = false)
    @Builder.Default
    private int defenseBonus = 0;

    @Column(nullable = false)
    @Builder.Default
    private int hpBonus = 0;

    @Column(nullable = false)
    @Builder.Default
    private int mpBonus = 0;

    @Column(nullable = false)
    @Builder.Default
    private int agiBonus = 0;

    // --- Economy ---
    @Column(nullable = false)
    private long priceStellas;

    @Column(nullable = false)
    private long priceCrystals;

    // --- Quantity & Flags ---
    @Column(nullable = false)
    @Builder.Default
    private int quantity = 1;

    @Column(nullable = false)
    @Builder.Default
    private boolean consumable = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean usableInBattle = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean equipped = false;

    // --- Forge level requirement ---
    @Column(nullable = false)
    @Builder.Default
    private int requiredForgeLevel = 1;

    // --- Crafting Recipe Components ---
    private int requiredOre;
    private int requiredTimber;
    private int requiredWater;

    public Item createPlayerCopy(Long telegramId, int qty) {
        return Item.builder()
                .playerTelegramId(telegramId)
                .name(this.name)
                .itemType(this.itemType)
                .rarity(this.rarity)
                .description(this.description)
                .attackBonus(this.attackBonus)
                .defenseBonus(this.defenseBonus)
                .hpBonus(this.hpBonus)
                .mpBonus(this.mpBonus)
                .agiBonus(this.agiBonus)
                .priceStellas(this.priceStellas)
                .priceCrystals(this.priceCrystals)
                .quantity(qty)
                .consumable(this.consumable)
                .usableInBattle(this.usableInBattle)
                .equipped(false)
                .requiredForgeLevel(this.requiredForgeLevel)
                .requiredOre(this.requiredOre)
                .requiredTimber(this.requiredTimber)
                .requiredWater(this.requiredWater)
                .build();
    }
}
