package com.app.repository;

import com.app.domain.Diary;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Diary entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long> {
    @Query("Select d from Diary d inner join d.officer o where o.id =:id ")
    public List<Diary> getAllByOfficer(@Param("id") Long id);
}
