package com.app.repository;

import com.app.domain.ResearchArea;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ResearchArea entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ResearchAreaRepository extends JpaRepository<ResearchArea, Long> {

}
