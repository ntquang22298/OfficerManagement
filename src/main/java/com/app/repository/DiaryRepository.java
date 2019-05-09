package com.app.repository;

import com.app.domain.Diary;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Diary entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long> {

}
