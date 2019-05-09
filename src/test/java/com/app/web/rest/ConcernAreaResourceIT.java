package com.app.web.rest;

import com.app.OfficerManagementApp;
import com.app.domain.ConcernArea;
import com.app.repository.ConcernAreaRepository;
import com.app.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;

import static com.app.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link ConcernAreaResource} REST controller.
 */
@SpringBootTest(classes = OfficerManagementApp.class)
public class ConcernAreaResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private ConcernAreaRepository concernAreaRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restConcernAreaMockMvc;

    private ConcernArea concernArea;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ConcernAreaResource concernAreaResource = new ConcernAreaResource(concernAreaRepository);
        this.restConcernAreaMockMvc = MockMvcBuilders.standaloneSetup(concernAreaResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ConcernArea createEntity(EntityManager em) {
        ConcernArea concernArea = new ConcernArea()
            .name(DEFAULT_NAME);
        return concernArea;
    }

    @BeforeEach
    public void initTest() {
        concernArea = createEntity(em);
    }

    @Test
    @Transactional
    public void createConcernArea() throws Exception {
        int databaseSizeBeforeCreate = concernAreaRepository.findAll().size();

        // Create the ConcernArea
        restConcernAreaMockMvc.perform(post("/api/concern-areas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(concernArea)))
            .andExpect(status().isCreated());

        // Validate the ConcernArea in the database
        List<ConcernArea> concernAreaList = concernAreaRepository.findAll();
        assertThat(concernAreaList).hasSize(databaseSizeBeforeCreate + 1);
        ConcernArea testConcernArea = concernAreaList.get(concernAreaList.size() - 1);
        assertThat(testConcernArea.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createConcernAreaWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = concernAreaRepository.findAll().size();

        // Create the ConcernArea with an existing ID
        concernArea.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restConcernAreaMockMvc.perform(post("/api/concern-areas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(concernArea)))
            .andExpect(status().isBadRequest());

        // Validate the ConcernArea in the database
        List<ConcernArea> concernAreaList = concernAreaRepository.findAll();
        assertThat(concernAreaList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllConcernAreas() throws Exception {
        // Initialize the database
        concernAreaRepository.saveAndFlush(concernArea);

        // Get all the concernAreaList
        restConcernAreaMockMvc.perform(get("/api/concern-areas?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(concernArea.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }
    
    @Test
    @Transactional
    public void getConcernArea() throws Exception {
        // Initialize the database
        concernAreaRepository.saveAndFlush(concernArea);

        // Get the concernArea
        restConcernAreaMockMvc.perform(get("/api/concern-areas/{id}", concernArea.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(concernArea.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingConcernArea() throws Exception {
        // Get the concernArea
        restConcernAreaMockMvc.perform(get("/api/concern-areas/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateConcernArea() throws Exception {
        // Initialize the database
        concernAreaRepository.saveAndFlush(concernArea);

        int databaseSizeBeforeUpdate = concernAreaRepository.findAll().size();

        // Update the concernArea
        ConcernArea updatedConcernArea = concernAreaRepository.findById(concernArea.getId()).get();
        // Disconnect from session so that the updates on updatedConcernArea are not directly saved in db
        em.detach(updatedConcernArea);
        updatedConcernArea
            .name(UPDATED_NAME);

        restConcernAreaMockMvc.perform(put("/api/concern-areas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedConcernArea)))
            .andExpect(status().isOk());

        // Validate the ConcernArea in the database
        List<ConcernArea> concernAreaList = concernAreaRepository.findAll();
        assertThat(concernAreaList).hasSize(databaseSizeBeforeUpdate);
        ConcernArea testConcernArea = concernAreaList.get(concernAreaList.size() - 1);
        assertThat(testConcernArea.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingConcernArea() throws Exception {
        int databaseSizeBeforeUpdate = concernAreaRepository.findAll().size();

        // Create the ConcernArea

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConcernAreaMockMvc.perform(put("/api/concern-areas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(concernArea)))
            .andExpect(status().isBadRequest());

        // Validate the ConcernArea in the database
        List<ConcernArea> concernAreaList = concernAreaRepository.findAll();
        assertThat(concernAreaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteConcernArea() throws Exception {
        // Initialize the database
        concernAreaRepository.saveAndFlush(concernArea);

        int databaseSizeBeforeDelete = concernAreaRepository.findAll().size();

        // Delete the concernArea
        restConcernAreaMockMvc.perform(delete("/api/concern-areas/{id}", concernArea.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<ConcernArea> concernAreaList = concernAreaRepository.findAll();
        assertThat(concernAreaList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ConcernArea.class);
        ConcernArea concernArea1 = new ConcernArea();
        concernArea1.setId(1L);
        ConcernArea concernArea2 = new ConcernArea();
        concernArea2.setId(concernArea1.getId());
        assertThat(concernArea1).isEqualTo(concernArea2);
        concernArea2.setId(2L);
        assertThat(concernArea1).isNotEqualTo(concernArea2);
        concernArea1.setId(null);
        assertThat(concernArea1).isNotEqualTo(concernArea2);
    }
}
