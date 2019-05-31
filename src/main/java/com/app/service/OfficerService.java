package com.app.service;

import com.app.domain.Officer;
import com.app.domain.enumeration.OfficerDegree;
import com.app.domain.enumeration.OfficerType;
import com.app.service.dto.OfficerDTO;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OfficerService {

    /**
     * Create/Update officer
     *
     * @param officer
     * @return officer entity
     */
    Officer save(Officer officer);

    /**
     * Delete officer by id
     *
     * @param id : id of officer you want to delete
     */
    void delete(Long id);

    /**
     * searching officer
     *
     * @param key: unit's name or part of unit's name
     * @param degree: degree of officer
     * @param type : type of officer
     * @return officer
     */
    List<OfficerDTO> search(String key, OfficerDegree degree, OfficerType type);

    /**
     * Find all officers
     *
     * @return officer
     */
    List<OfficerDTO> findAll();

    /**
     * find officer by id
     *
     * @param id
     * @return officer
     */
    OfficerDTO findOne(Long id);

    /**
     * search officer by name
     *
     * @param key: part of officer's name
     * @return officer
     */
    List<OfficerDTO> findByName(String key);

    /**
     * Find officer by current user login
     *
     * @param id: id of current user
     * @return officer
     */
    Officer findByUser();

    List<OfficerDTO> findByResearchArea(Long id);
    
}
