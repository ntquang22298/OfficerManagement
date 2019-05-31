package com.app.web.rest;

import com.app.domain.Diary;
import com.app.domain.Unit;
import com.app.domain.enumeration.UnitType;
import com.app.repository.DiaryRepository;
import com.app.repository.UnitRepository;
import com.app.service.UnitService;
import com.app.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.app.domain.Unit}.
 */
@RestController
@RequestMapping("/api")
public class UnitResource {

    private final Logger log = LoggerFactory.getLogger(UnitResource.class);

    private static final String ENTITY_NAME = "unit";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UnitRepository unitRepository;
    private final UnitService unitService;
    private final DiaryRepository diaryRepository;

    public UnitResource(UnitRepository unitRepository, UnitService unitService, DiaryRepository diaryRepository) {
        this.unitRepository = unitRepository;
        this.unitService = unitService;
        this.diaryRepository = diaryRepository;
    }

    /**
     * {@code POST  /units} : Create a new unit.
     *
     * @param unit the unit to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and
     * with body the new unit, or with status {@code 400 (Bad Request)} if the
     * unit has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/units")
    public ResponseEntity<Unit> createUnit(@RequestBody Unit unit) throws URISyntaxException {
        log.debug("REST request to save Unit : {}", unit);
        if (unit.getId() != null) {
            throw new BadRequestAlertException("A new unit cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Unit result = unitService.save(unit);
        if (result != null) {
            // create diary
            Diary diary = new Diary();
            diary.setContent("Create unit");
            diary.setTime(ZonedDateTime.now());
            diaryRepository.save(diary);
            //
        }
        return ResponseEntity.created(new URI("/api/units/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                .body(result);
    }

    /**
     * {@code PUT  /units} : Updates an existing unit.
     *
     * @param unit the unit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with
     * body the updated unit, or with status {@code 400 (Bad Request)} if the
     * unit is not valid, or with status {@code 500 (Internal Server Error)} if
     * the unit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/units")
    public ResponseEntity<Unit> updateUnit(@RequestBody Unit unit) throws URISyntaxException {
        log.debug("REST request to update Unit : {}", unit);
        if (unit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Unit result = unitService.save(unit);
        if (result != null) {
            // create diary
            Diary diary = new Diary();
            diary.setContent("Update unit");
            diary.setTime(ZonedDateTime.now());
            diaryRepository.save(diary);
            //
        }
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, unit.getId().toString()))
                .body(result);
    }

    /**
     * {@code GET  /units} : get all the units.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the
     * list of units in body.
     */
    @GetMapping("/units")
    public List<Unit> getAllUnits() {
        log.debug("REST request to get all Units");
        return unitRepository.findAll();
    }

    /**
     * {@code GET  /units/:id} : get the "id" unit.
     *
     * @param id the id of the unit to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with
     * body the unit, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/units/{id}")
    public ResponseEntity<Unit> getUnit(@PathVariable Long id) {
        log.debug("REST request to get Unit : {}", id);
        Optional<Unit> unit = unitRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(unit);
    }

    /**
     * {@code DELETE  /units/:id} : delete the "id" unit.
     *
     * @param id the id of the unit to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/units/{id}")
    public ResponseEntity<Void> deleteUnit(@PathVariable Long id) {
        log.debug("REST request to delete Unit : {}", id);
        unitService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/units-by-type/{type}")
    public List<Unit> getAllUnitsByType(@PathVariable String type) {
        log.debug("REST request to get all Units by type");
        UnitType unitType = UnitType.BOMON;
        if (type.equals("BOMON")) {
            unitType = UnitType.BOMON;
        } else if (type.equals("PHONGTHINGHIEM")) {
            unitType = UnitType.PHONGTHINGHIEM;
        }
        return unitService.findByType(unitType);
    }

    @GetMapping("/units-by-name/{key}")
    public List<Unit> getAllUnits(@PathVariable String key) {
        log.debug("REST request to get all Units by name");
        return unitService.findByName(key);
    }
}
