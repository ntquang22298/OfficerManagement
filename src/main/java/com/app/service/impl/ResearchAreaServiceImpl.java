package com.app.service.impl;

import com.app.domain.Diary;
import com.app.domain.Officer;
import com.app.domain.ResearchArea;
import com.app.repository.DiaryRepository;
import com.app.repository.OfficerRepository;
import com.app.repository.ResearchAreaRepository;
import com.app.service.ResearchAreaService;
import com.app.web.rest.errors.BadRequestAlertException;
import java.time.ZonedDateTime;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ResearchAreaServiceImpl implements ResearchAreaService {

    private final Logger log = LoggerFactory.getLogger(ResearchAreaServiceImpl.class);
    private final ResearchAreaRepository researchAreaRepository;
    private final OfficerRepository officerRepository;
    private final DiaryRepository diaryRepository;

    public ResearchAreaServiceImpl(ResearchAreaRepository researchAreaRepository, OfficerRepository officerRepository, DiaryRepository diaryRepository) {
        this.researchAreaRepository = researchAreaRepository;
        this.officerRepository = officerRepository;
        this.diaryRepository = diaryRepository;
    }

    public void delete(Long id) {
        ResearchArea researchArea = researchAreaRepository.findById(id).orElseThrow(() -> new BadRequestAlertException("ResearchArea not found", null, null));
        List<Officer> officers = officerRepository.findAllByResearchArea(id);
        for (Officer officer : officers) {
            officer.removeResearchAreas(researchArea);
            officerRepository.save(officer);

            Diary diaryOfficer = new Diary();
            diaryOfficer.setContent("Lĩnh vực "+researchArea.getName()+"đã bị loại bỏ!");
            diaryOfficer.setTime(ZonedDateTime.now());
            diaryOfficer.setOfficer(officer);
            diaryRepository.save(diaryOfficer);

        }

        researchAreaRepository.delete(researchArea);
    }

}
