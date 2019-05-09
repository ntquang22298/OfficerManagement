package com.app.service.impl;

import com.app.domain.Diary;
import com.app.domain.Officer;
import com.app.repository.DiaryRepository;
import com.app.repository.OfficerRepository;
import com.app.security.AuthoritiesConstants;
import com.app.security.SecurityUtils;
import com.app.service.OfficerService;
import com.app.web.rest.errors.BadRequestAlertException;
import java.time.ZonedDateTime;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class OfficerServiceImpl implements OfficerService {

    private final Logger log = LoggerFactory.getLogger(OfficerServiceImpl.class);
    private final OfficerRepository officerRepository;
    private final DiaryRepository diaryRepository;

    public OfficerServiceImpl(OfficerRepository officerRepository, DiaryRepository diaryRepository) {
        this.officerRepository = officerRepository;
        this.diaryRepository = diaryRepository;
    }

    @Override
    public Officer save(Officer officer) {
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN) || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.USER)) {
            return officerRepository.save(officer);
        }
        throw new BadRequestAlertException("Your account is not authorized to perform this action", null, null);
    }

    @Override
    public void delete(Long id) {
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            Diary diary = new Diary();
            diary.setContent("Delete officer");
            diary.setTime(ZonedDateTime.now());
            diaryRepository.save(diary);
            officerRepository.deleteById(id);
            return;
        }
        throw new BadRequestAlertException("Your account is not authorized to perform this action", null, null);

    }

    @Override
    public List<Officer> findAllByUnit(String key) {
        
        return officerRepository.findAllByUnit("%"+key+"%");
        
    }

}
