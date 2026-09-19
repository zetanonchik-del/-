package com.tensura.repository;

import com.tensura.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByPlayerTelegramId(Long playerTelegramId);

    List<Item> findByPlayerTelegramIdIsNull();

    Optional<Item> findByNameAndPlayerTelegramIdIsNull(String name);

    Optional<Item> findByIdAndPlayerTelegramId(Long id, Long playerTelegramId);

    Optional<Item> findByNameAndPlayerTelegramId(String name, Long playerTelegramId);

    List<Item> findByPlayerTelegramIdAndEquippedTrue(Long playerTelegramId);

    @Query("SELECT i FROM Item i WHERE i.playerTelegramId IS NULL AND i.requiredForgeLevel <= :forgeLevel")
    List<Item> findCraftableRecipes(int forgeLevel);
}
