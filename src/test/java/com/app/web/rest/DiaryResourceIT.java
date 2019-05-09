package com.app.web.rest;

import com.app.OfficerManagementApp;
import com.app.domain.Diary;
import com.app.repository.DiaryRepository;
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
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static com.app.web.rest.TestUtil.sameInstant;
import static com.app.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link DiaryResource} REST controller.
 */
@SpringBootTest(classes = OfficerManagementApp.class)
public class DiaryResourceIT {

    private static final ZonedDateTime DEFAULT_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    @Autowired
    private DiaryRepository diaryRepository;

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

    private MockMvc restDiaryMockMvc;

    private Diary diary;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DiaryResource diaryResource = new DiaryResource(diaryRepository);
        this.restDiaryMockMvc = MockMvcBuilders.standaloneSetup(diaryResource)
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
    public static Diary createEntity(EntityManager em) {
        Diary diary = new Diary()
            .time(DEFAULT_TIME)
            .content(DEFAULT_CONTENT);
        return diary;
    }

    @BeforeEach
    public void initTest() {
        diary = createEntity(em);
    }

    @Test
    @Transactional
    public void createDiary() throws Exception {
        int databaseSizeBeforeCreate = diaryRepository.findAll().size();

        // Create the Diary
        restDiaryMockMvc.perform(post("/api/diaries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(diary)))
            .andExpect(status().isCreated());

        // Validate the Diary in the database
        List<Diary> diaryList = diaryRepository.findAll();
        assertThat(diaryList).hasSize(databaseSizeBeforeCreate + 1);
        Diary testDiary = diaryList.get(diaryList.size() - 1);
        assertThat(testDiary.getTime()).isEqualTo(DEFAULT_TIME);
        assertThat(testDiary.getContent()).isEqualTo(DEFAULT_CONTENT);
    }

    @Test
    @Transactional
    public void createDiaryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = diaryRepository.findAll().size();

        // Create the Diary with an existing ID
        diary.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDiaryMockMvc.perform(post("/api/diaries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(diary)))
            .andExpect(status().isBadRequest());

        // Validate the Diary in the database
        List<Diary> diaryList = diaryRepository.findAll();
        assertThat(diaryList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllDiaries() throws Exception {
        // Initialize the database
        diaryRepository.saveAndFlush(diary);

        // Get all the diaryList
        restDiaryMockMvc.perform(get("/api/diaries?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(diary.getId().intValue())))
            .andExpect(jsonPath("$.[*].time").value(hasItem(sameInstant(DEFAULT_TIME))))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())));
    }
    
    @Test
    @Transactional
    public void getDiary() throws Exception {
        // Initialize the database
        diaryRepository.saveAndFlush(diary);

        // Get the diary
        restDiaryMockMvc.perform(get("/api/diaries/{id}", diary.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(diary.getId().intValue()))
            .andExpect(jsonPath("$.time").value(sameInstant(DEFAULT_TIME)))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingDiary() throws Exception {
        // Get the diary
        restDiaryMockMvc.perform(get("/api/diaries/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDiary() throws Exception {
        // Initialize the database
        diaryRepository.saveAndFlush(diary);

        int databaseSizeBeforeUpdate = diaryRepository.findAll().size();

        // Update the diary
        Diary updatedDiary = diaryRepository.findById(diary.getId()).get();
        // Disconnect from session so that the updates on updatedDiary are not directly saved in db
        em.detach(updatedDiary);
        updatedDiary
            .time(UPDATED_TIME)
            .content(UPDATED_CONTENT);

        restDiaryMockMvc.perform(put("/api/diaries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDiary)))
            .andExpect(status().isOk());

        // Validate the Diary in the database
        List<Diary> diaryList = diaryRepository.findAll();
        assertThat(diaryList).hasSize(databaseSizeBeforeUpdate);
        Diary testDiary = diaryList.get(diaryList.size() - 1);
        assertThat(testDiary.getTime()).isEqualTo(UPDATED_TIME);
        assertThat(testDiary.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    @Transactional
    public void updateNonExistingDiary() throws Exception {
        int databaseSizeBeforeUpdate = diaryRepository.findAll().size();

        // Create the Diary

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDiaryMockMvc.perform(put("/api/diaries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(diary)))
            .andExpect(status().isBadRequest());

        // Validate the Diary in the database
        List<Diary> diaryList = diaryRepository.findAll();
        assertThat(diaryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteDiary() throws Exception {
        // Initialize the database
        diaryRepository.saveAndFlush(diary);

        int databaseSizeBeforeDelete = diaryRepository.findAll().size();

        // Delete the diary
        restDiaryMockMvc.perform(delete("/api/diaries/{id}", diary.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<Diary> diaryList = diaryRepository.findAll();
        assertThat(diaryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Diary.class);
        Diary diary1 = new Diary();
        diary1.setId(1L);
        Diary diary2 = new Diary();
        diary2.setId(diary1.getId());
        assertThat(diary1).isEqualTo(diary2);
        diary2.setId(2L);
        assertThat(diary1).isNotEqualTo(diary2);
        diary1.setId(null);
        assertThat(diary1).isNotEqualTo(diary2);
    }
}
