package com.tensura.repository;

import com.tensura.entity.Monster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonsterRepository extends JpaRepository<Monster, Long> {

    List<Monster> findByRank(String rank);

    List<Monster> findByIsBossTrue();

    List<Monster> findByIsRaidTargetTrue();

    Optional<Monster> findByName(String name);

    List<Monster> findByLevelBetween(int minLevel, int maxLevel);
}
