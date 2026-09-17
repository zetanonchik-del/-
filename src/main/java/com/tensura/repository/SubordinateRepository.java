package com.tensura.repository;

import com.tensura.entity.Subordinate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubordinateRepository extends JpaRepository<Subordinate, Long> {

    List<Subordinate> findByMasterTelegramId(Long masterTelegramId);

    Optional<Subordinate> findByIdAndMasterTelegramId(Long id, Long masterTelegramId);

    List<Subordinate> findByMasterTelegramIdAndInCombatSquadTrue(Long masterTelegramId);

    int countByMasterTelegramId(Long masterTelegramId);
}
