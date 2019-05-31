package com.app.web.rest;

import com.app.domain.ResearchArea;
import com.app.repository.ResearchAreaRepository;
import com.app.service.ResearchAreaService;
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
 * REST controller for managing {@link com.app.domain.ResearchArea}.
 */
@RestController
@RequestMapping("/api")
public class ResearchAreaResource {

    private final Logger log = LoggerFactory.getLogger(ResearchAreaResource.class);

    private static final String ENTITY_NAME = "researchArea";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ResearchAreaRepository researchAreaRepository;
    private final ResearchAreaService researchAreaService;

    public ResearchAreaResource(ResearchAreaRepository researchAreaRepository, ResearchAreaService researchAreaService) {
        this.researchAreaRepository = researchAreaRepository;
        this.researchAreaService = researchAreaService;
    }

    /**
     * {@code POST  /research-areas} : Create a new researchArea.
     *
     * @param researchArea the researchArea to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and
     * with body the new researchArea, or with status {@code 400 (Bad Request)}
     * if the researchArea has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/research-areas")
    public ResponseEntity<ResearchArea> createResearchArea(@RequestBody ResearchArea researchArea) throws URISyntaxException {
        log.debug("REST request to save ResearchArea : {}", researchArea);
        if (researchArea.getId() != null) {
            throw new BadRequestAlertException("A new researchArea cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ResearchArea result = researchAreaRepository.save(researchArea);
        return ResponseEntity.created(new URI("/api/research-areas/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                .body(result);
    }

    /**
     * {@code PUT  /research-areas} : Updates an existing researchArea.
     *
     * @param researchArea the researchArea to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with
     * body the updated researchArea, or with status {@code 400 (Bad Request)}
     * if the researchArea is not valid, or with status
     * {@code 500 (Internal Server Error)} if the researchArea couldn't be
     * updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/research-areas")
    public ResponseEntity<ResearchArea> updateResearchArea(@RequestBody ResearchArea researchArea) throws URISyntaxException {
        log.debug("REST request to update ResearchArea : {}", researchArea);
        if (researchArea.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ResearchArea result = researchAreaRepository.save(researchArea);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, researchArea.getId().toString()))
                .body(result);
    }

    /**
     * {@code GET  /research-areas} : get all the researchAreas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the
     * list of researchAreas in body.
     */
    @GetMapping("/research-areas")
    public List<ResearchArea> getAllResearchAreas() {
        log.debug("REST request to get all ResearchAreas");
        return researchAreaRepository.findAll();
    }

    /**
     * {@code GET  /research-areas/:id} : get the "id" researchArea.
     *
     * @param id the id of the researchArea to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with
     * body the researchArea, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/research-areas/{id}")
    public ResponseEntity<ResearchArea> getResearchArea(@PathVariable Long id) {
        log.debug("REST request to get ResearchArea : {}", id);
        Optional<ResearchArea> researchArea = researchAreaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(researchArea);
    }

    /**
     * {@code DELETE  /research-areas/:id} : delete the "id" researchArea.
     *
     * @param id the id of the researchArea to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/research-areas/{id}")
    public ResponseEntity<Void> deleteResearchArea(@PathVariable Long id) {
        log.debug("REST request to delete ResearchArea : {}", id);
        researchAreaService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     *
     * @return all childs of a researchArea entity
     */
    @GetMapping("/research-areas-childs/{id}")
    public List<ResearchArea> getAllChilds(@PathVariable(name = "id") Long id) {
        log.debug("REST request to get all childs of a researchArea entity");
        return researchAreaRepository.getAllChilds(id);
    }
}
