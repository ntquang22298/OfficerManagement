package com.app.repository;

import com.app.domain.Unit;
import com.app.domain.enumeration.UnitType;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data repository for the Unit entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UnitRepository extends JpaRepository<Unit, Long> {

    @Query("Select u from Unit u where u.type =:type ")
    List<Unit> findByType(@Param("type") UnitType type);

    @Query("Select u from Unit u where u.name like:key ")
    List<Unit> findByName(@Param("key") String key);
}
