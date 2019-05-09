package com.app.web.rest;

import com.app.OfficerManagementApp;
import com.app.domain.ResearchArea;
import com.app.repository.ResearchAreaRepository;
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
 * Integration tests for the {@Link ResearchAreaResource} REST controller.
 */
@SpringBootTest(classes = OfficerManagementApp.class)
public class ResearchAreaResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private ResearchAreaRepository researchAreaRepository;

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

    private MockMvc restResearchAreaMockMvc;

    private ResearchArea researchArea;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ResearchAreaResource researchAreaResource = new ResearchAreaResource(researchAreaRepository);
        this.restResearchAreaMockMvc = MockMvcBuilders.standaloneSetup(researchAreaResource)
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
    public static ResearchArea createEntity(EntityManager em) {
        ResearchArea researchArea = new ResearchArea()
            .name(DEFAULT_NAME);
        return researchArea;
    }

    @BeforeEach
    public void initTest() {
        researchArea = createEntity(em);
    }

    @Test
    @Transactional
    public void createResearchArea() throws Exception {
        int databaseSizeBeforeCreate = researchAreaRepository.findAll().size();

        // Create the ResearchArea
        restResearchAreaMockMvc.perform(post("/api/research-areas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(researchArea)))
            .andExpect(status().isCreated());

        // Validate the ResearchArea in the database
        List<ResearchArea> researchAreaList = researchAreaRepository.findAll();
        assertThat(researchAreaList).hasSize(databaseSizeBeforeCreate + 1);
        ResearchArea testResearchArea = researchAreaList.get(researchAreaList.size() - 1);
        assertThat(testResearchArea.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createResearchAreaWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = researchAreaRepository.findAll().size();

        // Create the ResearchArea with an existing ID
        researchArea.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restResearchAreaMockMvc.perform(post("/api/research-areas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(researchArea)))
            .andExpect(status().isBadRequest());

        // Validate the ResearchArea in the database
        List<ResearchArea> researchAreaList = researchAreaRepository.findAll();
        assertThat(researchAreaList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllResearchAreas() throws Exception {
        // Initialize the database
        researchAreaRepository.saveAndFlush(researchArea);

        // Get all the researchAreaList
        restResearchAreaMockMvc.perform(get("/api/research-areas?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(researchArea.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }
    
    @Test
    @Transactional
    public void getResearchArea() throws Exception {
        // Initialize the database
        researchAreaRepository.saveAndFlush(researchArea);

        // Get the researchArea
        restResearchAreaMockMvc.perform(get("/api/research-areas/{id}", researchArea.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(researchArea.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingResearchArea() throws Exception {
        // Get the researchArea
        restResearchAreaMockMvc.perform(get("/api/research-areas/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateResearchArea() throws Exception {
        // Initialize the database
        researchAreaRepository.saveAndFlush(researchArea);

        int databaseSizeBeforeUpdate = researchAreaRepository.findAll().size();

        // Update the researchArea
        ResearchArea updatedResearchArea = researchAreaRepository.findById(researchArea.getId()).get();
        // Disconnect from session so that the updates on updatedResearchArea are not directly saved in db
        em.detach(updatedResearchArea);
        updatedResearchArea
            .name(UPDATED_NAME);

        restResearchAreaMockMvc.perform(put("/api/research-areas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedResearchArea)))
            .andExpect(status().isOk());

        // Validate the ResearchArea in the database
        List<ResearchArea> researchAreaList = researchAreaRepository.findAll();
        assertThat(researchAreaList).hasSize(databaseSizeBeforeUpdate);
        ResearchArea testResearchArea = researchAreaList.get(researchAreaList.size() - 1);
        assertThat(testResearchArea.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingResearchArea() throws Exception {
        int databaseSizeBeforeUpdate = researchAreaRepository.findAll().size();

        // Create the ResearchArea

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResearchAreaMockMvc.perform(put("/api/research-areas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(researchArea)))
            .andExpect(status().isBadRequest());

        // Validate the ResearchArea in the database
        List<ResearchArea> researchAreaList = researchAreaRepository.findAll();
        assertThat(researchAreaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteResearchArea() throws Exception {
        // Initialize the database
        researchAreaRepository.saveAndFlush(researchArea);

        int databaseSizeBeforeDelete = researchAreaRepository.findAll().size();

        // Delete the researchArea
        restResearchAreaMockMvc.perform(delete("/api/research-areas/{id}", researchArea.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<ResearchArea> researchAreaList = researchAreaRepository.findAll();
        assertThat(researchAreaList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ResearchArea.class);
        ResearchArea researchArea1 = new ResearchArea();
        researchArea1.setId(1L);
        ResearchArea researchArea2 = new ResearchArea();
        researchArea2.setId(researchArea1.getId());
        assertThat(researchArea1).isEqualTo(researchArea2);
        researchArea2.setId(2L);
        assertThat(researchArea1).isNotEqualTo(researchArea2);
        researchArea1.setId(null);
        assertThat(researchArea1).isNotEqualTo(researchArea2);
    }
}
