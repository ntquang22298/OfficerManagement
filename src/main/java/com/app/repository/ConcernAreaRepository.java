package com.app.repository;

import com.app.domain.ConcernArea;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ConcernArea entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConcernAreaRepository extends JpaRepository<ConcernArea, Long> {

}
