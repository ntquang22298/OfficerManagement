package com.app.repository;

import com.app.domain.Officer;
import com.app.domain.enumeration.OfficerDegree;
import com.app.domain.enumeration.OfficerType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data repository for the Officer entity.
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

    @Query(value = "Select o from Officer o  where o.degree =:degree ")
    public List<Officer> findAllByDegree(@Param("degree") OfficerDegree degree);

    @Query("Select o from Officer o where o.type =:type ")
    public List<Officer> findAllByType(@Param("type") OfficerType type);

    @Query(value = "Select o from Officer o inner join o.unit u where u.name like :key and o.type =:type ")
    public List<Officer> findAllByUnitAndType(@Param("key") String key, @Param("type") OfficerType type);

    @Query(value = "Select o from Officer o inner join o.unit u where o.degree =:degree and u.name like :key  ")
    public List<Officer> findAllByUnitAndDegree(@Param("key") String key, @Param("degree") OfficerDegree degree);

    @Query(value = "Select o from Officer o where o.degree =:degree and o.type =:type ")
    public List<Officer> findAllByDegreeAndType(@Param("degree") OfficerDegree degree, @Param("type") OfficerType type);

    @Query(value = "Select o from Officer o  inner join o.unit u where u.name like :key and o.degree =:degree and o.type =:type ")
    public List<Officer> search(@Param("key") String key, @Param("degree") OfficerDegree degree, @Param("type") OfficerType type);

    @Query(value = "Select o from Officer o  where o.fullName like :key ")
    public List<Officer> findAllByName(@Param("key") String key);

    @Query("Select o from Officer o left join fetch o.researchAreas left join fetch o.concernAreas where o.user.login =:login ")
    public Officer findByUser(@Param("login") String login);
}
