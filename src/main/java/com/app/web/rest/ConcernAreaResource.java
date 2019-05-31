package com.app.web.rest;

import com.app.domain.ConcernArea;
import com.app.domain.Officer;
import com.app.repository.ConcernAreaRepository;
import com.app.repository.OfficerRepository;
import com.app.service.ConcernAreaService;
import com.app.service.OfficerService;
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

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.app.domain.ConcernArea}.
 */
@RestController
@RequestMapping("/api")
public class ConcernAreaResource {

    private final Logger log = LoggerFactory.getLogger(ConcernAreaResource.class);

    private static final String ENTITY_NAME = "concernArea";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ConcernAreaRepository concernAreaRepository;
    private final ConcernAreaService concernAreaService;
    private final OfficerService officerService;

    public ConcernAreaResource(ConcernAreaRepository concernAreaRepository, ConcernAreaService concernAreaService, OfficerService officerService) {
        this.concernAreaRepository = concernAreaRepository;
        this.concernAreaService = concernAreaService;
        this.officerService = officerService;
    }

    /**
     * {@code POST  /concern-areas} : Create a new concernArea.
     *
     * @param concernArea the concernArea to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and
     * with body the new concernArea, or with status {@code 400 (Bad Request)}
     * if the concernArea has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/concern-areas")
    public ResponseEntity<ConcernArea> createConcernArea(@RequestBody ConcernArea concernArea) throws URISyntaxException {
        log.debug("REST request to save ConcernArea : {}", concernArea);
        if (concernArea.getId() != null) {
            throw new BadRequestAlertException("A new concernArea cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ConcernArea result = concernAreaService.save(concernArea);
        return ResponseEntity.created(new URI("/api/concern-areas/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                .body(result);
    }

    /**
     * {@code PUT  /concern-areas} : Updates an existing concernArea.
     *
     * @param concernArea the concernArea to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with
     * body the updated concernArea, or with status {@code 400 (Bad Request)} if
     * the concernArea is not valid, or with status
     * {@code 500 (Internal Server Error)} if the concernArea couldn't be
     * updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/concern-areas")
    public ResponseEntity<ConcernArea> updateConcernArea(@RequestBody ConcernArea concernArea) throws URISyntaxException {
        log.debug("REST request to update ConcernArea : {}", concernArea);
        if (concernArea.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ConcernArea result = concernAreaRepository.save(concernArea);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, concernArea.getId().toString()))
                .body(result);
    }

    /**
     * {@code GET  /concern-areas} : get all the concernAreas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the
     * list of concernAreas in body.
     */
    @GetMapping("/concern-areas")
    public List<ConcernArea> getAllConcernAreas() {
        log.debug("REST request to get all ConcernAreas");
        return concernAreaRepository.findAll();
    }

    /**
     * {@code GET  /concern-areas/:id} : get the "id" concernArea.
     *
     * @param id the id of the concernArea to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with
     * body the concernArea, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/concern-areas/{id}")
    public ResponseEntity<ConcernArea> getConcernArea(@PathVariable Long id) {
        log.debug("REST request to get ConcernArea : {}", id);
        Optional<ConcernArea> concernArea = concernAreaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(concernArea);
    }

    /**
     * {@code DELETE  /concern-areas/:id} : delete the "id" concernArea.
     *
     * @param id the id of the concernArea to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/concern-areas/{id}")
    public ResponseEntity<Void> deleteConcernArea(@PathVariable Long id) {
        log.debug("REST request to delete ConcernArea : {}", id);
        concernAreaRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/concern-areas-officer")
    public List<ConcernArea> getAllConcernAreasByOfficer() {
        log.debug("REST request to get all ConcernAreas by officer");
        Officer officer = officerService.findByUser();
        return concernAreaRepository.findAllByUser(officer.getId());
    }
}
