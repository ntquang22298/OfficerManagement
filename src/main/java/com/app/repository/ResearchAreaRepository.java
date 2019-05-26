package com.app.repository;

import com.app.domain.ResearchArea;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data repository for the ResearchArea entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ResearchAreaRepository extends JpaRepository<ResearchArea, Long> {

    @Query("Select r from ResearchArea r where r.parent.id =:id ")
    public List<ResearchArea> findByUser(@Param("id") Long id);

}
