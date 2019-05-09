package com.app.web.rest;

import com.app.OfficerManagementApp;
import com.app.domain.Officer;
import com.app.repository.OfficerRepository;
import com.app.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

import static com.app.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.app.domain.enumeration.OfficerDegree;
import com.app.domain.enumeration.OfficerType;
/**
 * Integration tests for the {@Link OfficerResource} REST controller.
 */
@SpringBootTest(classes = OfficerManagementApp.class)
public class OfficerResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_FULL_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FULL_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_AVATAR_URL = "AAAAAAAAAA";
    private static final String UPDATED_AVATAR_URL = "BBBBBBBBBB";

    private static final String DEFAULT_V_NU_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_V_NU_EMAIL = "BBBBBBBBBB";

    private static final OfficerDegree DEFAULT_DEGREE = OfficerDegree.TS;
    private static final OfficerDegree UPDATED_DEGREE = OfficerDegree.PGSTS;

    private static final OfficerType DEFAULT_TYPE = OfficerType.HT;
    private static final OfficerType UPDATED_TYPE = OfficerType.PHT;

    @Autowired
    private OfficerRepository officerRepository;

    @Mock
    private OfficerRepository officerRepositoryMock;

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

    private MockMvc restOfficerMockMvc;

    private Officer officer;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final OfficerResource officerResource = new OfficerResource(officerRepository);
        this.restOfficerMockMvc = MockMvcBuilders.standaloneSetup(officerResource)
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
    public static Officer createEntity(EntityManager em) {
        Officer officer = new Officer()
            .code(DEFAULT_CODE)
            .fullName(DEFAULT_FULL_NAME)
            .avatarUrl(DEFAULT_AVATAR_URL)
            .vNUEmail(DEFAULT_V_NU_EMAIL)
            .degree(DEFAULT_DEGREE)
            .type(DEFAULT_TYPE);
        return officer;
    }

    @BeforeEach
    public void initTest() {
        officer = createEntity(em);
    }

    @Test
    @Transactional
    public void createOfficer() throws Exception {
        int databaseSizeBeforeCreate = officerRepository.findAll().size();

        // Create the Officer
        restOfficerMockMvc.perform(post("/api/officers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(officer)))
            .andExpect(status().isCreated());

        // Validate the Officer in the database
        List<Officer> officerList = officerRepository.findAll();
        assertThat(officerList).hasSize(databaseSizeBeforeCreate + 1);
        Officer testOfficer = officerList.get(officerList.size() - 1);
        assertThat(testOfficer.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testOfficer.getFullName()).isEqualTo(DEFAULT_FULL_NAME);
        assertThat(testOfficer.getAvatarUrl()).isEqualTo(DEFAULT_AVATAR_URL);
        assertThat(testOfficer.getvNUEmail()).isEqualTo(DEFAULT_V_NU_EMAIL);
        assertThat(testOfficer.getDegree()).isEqualTo(DEFAULT_DEGREE);
        assertThat(testOfficer.getType()).isEqualTo(DEFAULT_TYPE);
    }

    @Test
    @Transactional
    public void createOfficerWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = officerRepository.findAll().size();

        // Create the Officer with an existing ID
        officer.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOfficerMockMvc.perform(post("/api/officers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(officer)))
            .andExpect(status().isBadRequest());

        // Validate the Officer in the database
        List<Officer> officerList = officerRepository.findAll();
        assertThat(officerList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllOfficers() throws Exception {
        // Initialize the database
        officerRepository.saveAndFlush(officer);

        // Get all the officerList
        restOfficerMockMvc.perform(get("/api/officers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(officer.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].fullName").value(hasItem(DEFAULT_FULL_NAME.toString())))
            .andExpect(jsonPath("$.[*].avatarUrl").value(hasItem(DEFAULT_AVATAR_URL.toString())))
            .andExpect(jsonPath("$.[*].vNUEmail").value(hasItem(DEFAULT_V_NU_EMAIL.toString())))
            .andExpect(jsonPath("$.[*].degree").value(hasItem(DEFAULT_DEGREE.toString())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllOfficersWithEagerRelationshipsIsEnabled() throws Exception {
        OfficerResource officerResource = new OfficerResource(officerRepositoryMock);
        when(officerRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restOfficerMockMvc = MockMvcBuilders.standaloneSetup(officerResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restOfficerMockMvc.perform(get("/api/officers?eagerload=true"))
        .andExpect(status().isOk());

        verify(officerRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllOfficersWithEagerRelationshipsIsNotEnabled() throws Exception {
        OfficerResource officerResource = new OfficerResource(officerRepositoryMock);
            when(officerRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restOfficerMockMvc = MockMvcBuilders.standaloneSetup(officerResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restOfficerMockMvc.perform(get("/api/officers?eagerload=true"))
        .andExpect(status().isOk());

            verify(officerRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getOfficer() throws Exception {
        // Initialize the database
        officerRepository.saveAndFlush(officer);

        // Get the officer
        restOfficerMockMvc.perform(get("/api/officers/{id}", officer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(officer.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE.toString()))
            .andExpect(jsonPath("$.fullName").value(DEFAULT_FULL_NAME.toString()))
            .andExpect(jsonPath("$.avatarUrl").value(DEFAULT_AVATAR_URL.toString()))
            .andExpect(jsonPath("$.vNUEmail").value(DEFAULT_V_NU_EMAIL.toString()))
            .andExpect(jsonPath("$.degree").value(DEFAULT_DEGREE.toString()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingOfficer() throws Exception {
        // Get the officer
        restOfficerMockMvc.perform(get("/api/officers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOfficer() throws Exception {
        // Initialize the database
        officerRepository.saveAndFlush(officer);

        int databaseSizeBeforeUpdate = officerRepository.findAll().size();

        // Update the officer
        Officer updatedOfficer = officerRepository.findById(officer.getId()).get();
        // Disconnect from session so that the updates on updatedOfficer are not directly saved in db
        em.detach(updatedOfficer);
        updatedOfficer
            .code(UPDATED_CODE)
            .fullName(UPDATED_FULL_NAME)
            .avatarUrl(UPDATED_AVATAR_URL)
            .vNUEmail(UPDATED_V_NU_EMAIL)
            .degree(UPDATED_DEGREE)
            .type(UPDATED_TYPE);

        restOfficerMockMvc.perform(put("/api/officers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedOfficer)))
            .andExpect(status().isOk());

        // Validate the Officer in the database
        List<Officer> officerList = officerRepository.findAll();
        assertThat(officerList).hasSize(databaseSizeBeforeUpdate);
        Officer testOfficer = officerList.get(officerList.size() - 1);
        assertThat(testOfficer.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testOfficer.getFullName()).isEqualTo(UPDATED_FULL_NAME);
        assertThat(testOfficer.getAvatarUrl()).isEqualTo(UPDATED_AVATAR_URL);
        assertThat(testOfficer.getvNUEmail()).isEqualTo(UPDATED_V_NU_EMAIL);
        assertThat(testOfficer.getDegree()).isEqualTo(UPDATED_DEGREE);
        assertThat(testOfficer.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    public void updateNonExistingOfficer() throws Exception {
        int databaseSizeBeforeUpdate = officerRepository.findAll().size();

        // Create the Officer

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOfficerMockMvc.perform(put("/api/officers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(officer)))
            .andExpect(status().isBadRequest());

        // Validate the Officer in the database
        List<Officer> officerList = officerRepository.findAll();
        assertThat(officerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteOfficer() throws Exception {
        // Initialize the database
        officerRepository.saveAndFlush(officer);

        int databaseSizeBeforeDelete = officerRepository.findAll().size();

        // Delete the officer
        restOfficerMockMvc.perform(delete("/api/officers/{id}", officer.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<Officer> officerList = officerRepository.findAll();
        assertThat(officerList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Officer.class);
        Officer officer1 = new Officer();
        officer1.setId(1L);
        Officer officer2 = new Officer();
        officer2.setId(officer1.getId());
        assertThat(officer1).isEqualTo(officer2);
        officer2.setId(2L);
        assertThat(officer1).isNotEqualTo(officer2);
        officer1.setId(null);
        assertThat(officer1).isNotEqualTo(officer2);
    }
}
