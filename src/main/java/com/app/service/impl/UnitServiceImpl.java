package com.app.service.impl;

import com.app.domain.Diary;
import com.app.domain.Unit;
import com.app.domain.enumeration.UnitType;
import com.app.repository.DiaryRepository;
import com.app.repository.UnitRepository;
import com.app.security.AuthoritiesConstants;
import com.app.security.SecurityUtils;
import com.app.service.UnitService;
import com.app.web.rest.errors.BadRequestAlertException;
import java.time.ZonedDateTime;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UnitServiceImpl implements UnitService {

    private final Logger log = LoggerFactory.getLogger(UnitServiceImpl.class);
    private final UnitRepository unitRepository;
    private final DiaryRepository diaryRepository;

    public UnitServiceImpl(UnitRepository unitRepository, DiaryRepository diaryRepository) {
        this.unitRepository = unitRepository;
        this.diaryRepository = diaryRepository;
    }


    
    @Override
    public Unit save(Unit unit) {
        if(SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)){
            return unitRepository.save(unit);
        }
        throw new BadRequestAlertException("Your account is not authorized to perform this action", null, null);
    }

    @Override
    public void delete(Long id) {
        if(SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)){
            Diary diary = new Diary();
            diary.setContent("Delete unit");
            diary.setTime(ZonedDateTime.now());
            diaryRepository.save(diary);
            unitRepository.deleteById(id);
            return;
        }
        throw new BadRequestAlertException("Your account is not authorized to perform this action", null, null);
    }

    @Override
    public List<Unit> findByType(UnitType type) {
        return unitRepository.findByType(type);
    }

    @Override
    public List<Unit> findByName(String key) {
        return unitRepository.findByName(key);
    }
    
}
