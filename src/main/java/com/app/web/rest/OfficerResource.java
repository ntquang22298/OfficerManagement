package com.app.web.rest;

import com.app.domain.Diary;
import com.app.domain.Officer;
import com.app.domain.User;
import com.app.domain.enumeration.OfficerDegree;
import com.app.domain.enumeration.OfficerType;
import com.app.repository.DiaryRepository;
import com.app.repository.OfficerRepository;
import com.app.repository.UserRepository;
import com.app.security.SecurityUtils;
import com.app.service.OfficerService;
import com.app.service.dto.OfficerDTO;
import com.app.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * REST controller for managing {@link com.app.domain.Officer}.
 */
@RestController
@RequestMapping("/api")
public class OfficerResource {

    private final Logger log = LoggerFactory.getLogger(OfficerResource.class);

    private static final String ENTITY_NAME = "officer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OfficerService officerService;
    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;

    public OfficerResource(OfficerService officerService, DiaryRepository diaryRepository, UserRepository userRepository) {
        this.officerService = officerService;
        this.diaryRepository = diaryRepository;
        this.userRepository = userRepository;
    }

    /**
     * {@code POST  /officers} : Create a new officer.
     *
     * @param officer the officer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and
     * with body the new officer, or with status {@code 400 (Bad Request)} if
     * the officer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/officers")
    public ResponseEntity<Officer> createOfficer(@RequestBody Officer officer) throws URISyntaxException {
        log.debug("REST request to save Officer : {}", officer);
        if (officer.getId() != null) {
            throw new BadRequestAlertException("A new officer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Officer result = officerService.save(officer);
        if (result != null) {
            // create diary
            Diary diary = new Diary();
            diary.setContent("Create officer");
            diary.setTime(ZonedDateTime.now());
            diaryRepository.save(diary);
            //
        }
        return ResponseEntity.created(new URI("/api/officers/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                .body(result);
    }

    /**
     * {@code PUT  /officers} : Updates an existing officer.
     *
     * @param officer the officer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with
     * body the updated officer, or with status {@code 400 (Bad Request)} if the
     * officer is not valid, or with status {@code 500 (Internal Server Error)}
     * if the officer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/officers")
    public ResponseEntity<Officer> updateOfficer(@RequestBody Officer officer) throws URISyntaxException {
        log.debug("REST request to update Officer : {}", officer);
        if (officer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Officer result = officerService.save(officer);
        if (result != null) {
            // create diary
            Diary diary = new Diary();
            Officer current = officerService.findByUser();
            diary.setOfficer(current);
            diary.setContent("Update officer");
            diary.setTime(ZonedDateTime.now());
            diaryRepository.save(diary);
            //
        }
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, officer.getId().toString()))
                .body(result);
    }

    /**
     * {@code GET  /officers} : get all the officers.
     *
     * @param eagerload flag to eager load entities from relationships (This is
     * applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the
     * list of officers in body.
     */
    @GetMapping("/officers")
    public List<OfficerDTO> getAllOfficers(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Officers");
        return officerService.findAll();
    }

    /**
     * {@code GET  /officers/:id} : get the "id" officer.
     *
     * @param id the id of the officer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with
     * body the officer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/officers/{id}")
    public ResponseEntity<OfficerDTO> getOfficer(@PathVariable Long id) {
        log.debug("REST request to get Officer : {}", id);
        OfficerDTO officer = officerService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(officer));
    }

    /**
     * {@code DELETE  /officers/:id} : delete the "id" officer.
     *
     * @param id the id of the officer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/officers/{id}")
    public ResponseEntity<Void> deleteOfficer(@PathVariable Long id) {
        log.debug("REST request to delete Officer : {}", id);
        officerService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * Search officer by unit/degree/type
     *
     * @param key : unit's name
     * @param degree: degree of officer
     * @param type : type of officer
     * @return officer list
     */
    @GetMapping("/officers-search/{key}/{degree}/{type}")
    public List<OfficerDTO> search(@PathVariable(name = "key") String key,
            @PathVariable(name = "degree") String degree, @PathVariable(name = "type") String type) {
        OfficerDegree officerdegree = OfficerDegree.TS;
        OfficerType officerType = OfficerType.GV;
        if (key.equals("0")) {
            key = null;
        }
        switch (degree) {
            case "TS":
                officerdegree = OfficerDegree.TS;
                break;
            case "CN":
                officerdegree = OfficerDegree.CN;
                break;
            case "GSTS":
                officerdegree = OfficerDegree.GSTS;
                break;
            case "PGSTS":
                officerdegree = OfficerDegree.PGSTS;
                break;
            case "ThS":
                officerdegree = OfficerDegree.ThS;
                break;
            default:
                officerdegree = null;
        }
        switch (type) {
            case "GV":
                officerType = OfficerType.GV;
                break;
            case "CNBM":
                officerType = OfficerType.CNBM;
                break;
            case "HT":
                officerType = OfficerType.HT;
                break;
            case "PCNBM":
                officerType = OfficerType.PCNBM;
                break;
            case "PHT":
                officerType = OfficerType.PHT;
                break;
            case "PK":
                officerType = OfficerType.PK;
                break;
            case "TK":
                officerType = OfficerType.GV;
                break;
            default:
                officerType = null;
        }
        log.debug("REST request to get all Officers by Unit");
        return officerService.search(key, officerdegree, officerType);
    }

    /**
     * Search officers by name
     *
     * @param key: part of officer's name
     * @return list of officers
     */
    @GetMapping("/officers-by-name/{key}")
    public List<OfficerDTO> getAllOfficersByName(@PathVariable(name = "key") String key) {
        log.debug("REST request to get all Officers by name");
        return officerService.findByName(key);
    }

    @GetMapping("/officers-by-user")
    public Officer getAllOfficersByName() throws Throwable {
        log.debug("REST request to get all Officers by user");
        return officerService.findByUser();
    }
    
        @GetMapping("/officers-by-research/{id}")
    public List<OfficerDTO> getAllOfficersByResearchArea(@PathVariable(name = "id") Long id) {
        log.debug("REST request to get all Officers by research");
        return officerService.findByResearchArea(id);
    }
    
}
