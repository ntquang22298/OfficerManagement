package com.app.repository;

import com.app.domain.ConcernArea;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ConcernArea entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConcernAreaRepository extends JpaRepository<ConcernArea, Long> {
    @Query("Select r from ConcernArea r inner join r.officers o where o.id =:id ")
    public List<ConcernArea> findAllByUser(@Param("id") Long id);
}
