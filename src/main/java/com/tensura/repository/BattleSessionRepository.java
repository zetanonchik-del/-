package com.tensura.repository;

import com.tensura.entity.BattleSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BattleSessionRepository extends JpaRepository<BattleSession, Long> {

    Optional<BattleSession> findByPlayerTelegramId(Long playerTelegramId);

    void deleteByPlayerTelegramId(Long playerTelegramId);

    boolean existsByPlayerTelegramId(Long playerTelegramId);
}
