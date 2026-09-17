package com.tensura.repository;

import com.tensura.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {

    Optional<Player> findByTelegramId(Long telegramId);

    boolean existsByTelegramId(Long telegramId);

    // Top leaderboard by Level & Combat Power
    @Query("SELECT p FROM Player p ORDER BY p.level DESC, p.attack DESC, p.maxHp DESC")
    List<Player> findTopLeaderboard();

    // Top labyrinth conquerors
    @Query("SELECT p FROM Player p ORDER BY p.highestLabyrinthFloor DESC, p.level DESC")
    List<Player> findTopLabyrinthRankings();
}
