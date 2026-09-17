package com.tensura.repository;

import com.tensura.entity.BunkerCity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<BunkerCity, Long> {

    Optional<BunkerCity> findByPlayerTelegramId(Long playerTelegramId);

    boolean existsByPlayerTelegramId(Long playerTelegramId);
}
