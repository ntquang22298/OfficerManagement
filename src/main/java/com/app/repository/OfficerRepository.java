package com.app.repository;

import com.app.domain.Officer;
import com.app.domain.Unit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Officer entity.
 */
@Repository
public interface OfficerRepository extends JpaRepository<Officer, Long> {

    @Query(value = "select distinct officer from Officer officer left join fetch officer.researchAreas left join fetch officer.concernAreas",
        countQuery = "select count(distinct officer) from Officer officer")
    Page<Officer> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct officer from Officer officer left join fetch officer.researchAreas left join fetch officer.concernAreas")
    List<Officer> findAllWithEagerRelationships();

    @Query("select officer from Officer officer left join fetch officer.researchAreas left join fetch officer.concernAreas where officer.id =:id")
    Officer findOneWithEagerRelationships(@Param("id") Long id);
        
    @Query(value = "Select o from Officer o inner join o.unit u where u.name like :key ")
    public List<Officer> findAllByUnit(@Param("key") String key);

}
