package com.app.service;

import com.app.domain.Unit;
import com.app.domain.enumeration.UnitType;
import java.util.List;

public interface UnitService {
    /**
     * Create/Update an unit
     * @param unit
     * @return unit entity
     */
    Unit save(Unit unit);
    /**
     * Delete an unit by id
     * @param id : id of unit want to delete
     */
    void delete(Long id);
    /**
     * Find all unit by type
     * @param type: type of unit (BOMON,PHONGTHINGHIEM)
     * @return a list of unit
     */
    List<Unit> findByType(UnitType type);
    /**
     * Find unit by name
     * @param key: part of unit's name
     * @return list units
     */
    List<Unit> findByName(String key);
}
