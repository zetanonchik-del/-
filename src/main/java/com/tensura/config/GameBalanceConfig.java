package com.tensura.config;

import org.springframework.stereotype.Component;

@Component
public class GameBalanceConfig {

    public static final int BASE_SLIME_HP = 120;
    public static final int BASE_SLIME_MP = 250;
    public static final int BASE_SLIME_ATK = 18;
    public static final int BASE_SLIME_DEF = 22;
    public static final int BASE_SLIME_AGI = 14;
    public static final int BASE_SLIME_INT = 30;
    public static final int BASE_MAX_STAMINA = 100;
    public static final int STAMINA_RECOVERY_MINUTES = 3;

    public static final long STARTING_STELLAS = 500L;
    public static final long STARTING_CRYSTALS = 10L;

    public static final double EXP_SCALING_EXPONENT = 1.35;
    public static final int BASE_EXP_REQUIREMENT = 100;

    public static long calculateRequiredExp(int level) {
        if (level <= 1) return BASE_EXP_REQUIREMENT;
        return (long) (BASE_EXP_REQUIREMENT * Math.pow(level, EXP_SCALING_EXPONENT) + (level * 50L));
    }

    public static final double BASE_CRIT_CHANCE = 0.05;
    public static final double BASE_CRIT_MULTIPLIER = 1.5;
    public static final double BASE_EVASION_CHANCE = 0.04;
    public static final double MAX_EVASION_CAP = 0.40;
    public static final double MAX_CRIT_CAP = 0.50;

    public static double calculateEvasionRate(int userAgi, int targetAgi) {
        double diff = (double) (userAgi - targetAgi) / Math.max(1, (userAgi + targetAgi));
        double evasion = BASE_EVASION_CHANCE + (diff * 0.25);
        return Math.max(0.02, Math.min(MAX_EVASION_CAP, evasion));
    }

    public static double calculateCritRate(int userAgi, int userInt) {
        double crit = BASE_CRIT_CHANCE + ((userAgi * 0.002) + (userInt * 0.001));
        return Math.min(MAX_CRIT_CAP, crit);
    }

    public static int calculateDamage(int attack, int targetDefense, double skillMultiplier, boolean isCrit) {
        double defenseMitigation = (double) targetDefense / (targetDefense + 100.0);
        double rawDamage = attack * skillMultiplier;
        double netDamage = rawDamage * (1.0 - (defenseMitigation * 0.75));
        if (isCrit) {
            netDamage *= BASE_CRIT_MULTIPLIER;
        }
        
        double variance = 0.95 + (Math.random() * 0.10);
        int finalDamage = (int) Math.round(netDamage * variance);
        return Math.max(1, finalDamage);
    }

    public static final int EVOLUTION_INTELLIGENT_SLIME_LEVEL = 20;
    public static final int EVOLUTION_INTELLIGENT_SLIME_MP = 2000;
    public static final long EVOLUTION_INTELLIGENT_SLIME_STELLAS = 5000L;

    public static final int EVOLUTION_DEMON_SLIME_LEVEL = 50;
    public static final int EVOLUTION_DEMON_SLIME_MP = 15000;
    public static final long EVOLUTION_DEMON_SLIME_SOULS = 1000L;

    public static final int EVOLUTION_TRUE_DEMON_LORD_LEVEL = 80;
    public static final int EVOLUTION_TRUE_DEMON_LORD_MP = 80000;
    public static final long EVOLUTION_HARVEST_FESTIVAL_SOULS = 10000L;

    public static final int EVOLUTION_DRAGONOID_LEVEL = 95;
    public static final int EVOLUTION_DRAGONOID_MP = 200000;
    public static final long EVOLUTION_DRAGON_FACTOR_CRYSTALS = 500L;

    public static final int NAMING_GOBLIN_COST_MP = 300;
    public static final int NAMING_ORC_COST_MP = 750;
    public static final int NAMING_LIZARDMAN_COST_MP = 1200;
    public static final int NAMING_OGRE_COST_MP = 3500;
    public static final int NAMING_DRAGON_KIN_COST_MP = 15000;
    public static final double NAMING_MAGICULE_DRAIN_RISK = 0.35; 

    public static final int BASE_TIMBER_PER_HOUR = 15;
    public static final int BASE_ORE_PER_HOUR = 8;
    public static final int BASE_STELLAS_PER_HOUR = 50;
    public static final int BASE_MAGIC_WATER_PER_HOUR = 5;

    public static final int LABYRINTH_MAX_FLOORS = 100;
    public static final int LABYRINTH_CHECKPOINT_INTERVAL = 10;

    public static final double BASE_DEVOUR_SKILL_CHANCE = 0.28;
    public static final double DEVOUR_STAT_BONUS_FRACTION = 0.04;
}
