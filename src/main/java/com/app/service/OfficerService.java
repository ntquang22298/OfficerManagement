package com.app.service;

import com.app.domain.Officer;
import java.util.List;

public interface OfficerService {
    /**
     * Create/Update officer
     * @param officer
     * @return officer entity
     */
    Officer save(Officer officer);
    /**
     * Delete officer by id
     * @param id : id of officer you want to delete
     */
    void delete(Long id);
    /**
     * Find officer by unit
     * @param key: unit's name or part of unit's name
     * @return list officer in that unit
     */
    List<Officer> findAllByUnit(String key);
}
