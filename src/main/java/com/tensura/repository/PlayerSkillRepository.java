package com.tensura.repository;

import com.tensura.entity.PlayerSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerSkillRepository extends JpaRepository<PlayerSkill, Long> {

    List<PlayerSkill> findByPlayerTelegramId(Long playerTelegramId);

    List<PlayerSkill> findByPlayerTelegramIdAndEquippedTrue(Long playerTelegramId);

    Optional<PlayerSkill> findByPlayerTelegramIdAndSkillName(Long playerTelegramId, String skillName);

    boolean existsByPlayerTelegramIdAndSkillName(Long playerTelegramId, String skillName);
}
