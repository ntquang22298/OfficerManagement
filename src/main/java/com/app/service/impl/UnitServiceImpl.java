package com.app.service.impl;

import com.app.domain.Diary;
import com.app.domain.Officer;
import com.app.domain.Unit;
import com.app.domain.enumeration.UnitType;
import com.app.repository.DiaryRepository;
import com.app.repository.OfficerRepository;
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
    private final OfficerRepository officerRepository;

    public UnitServiceImpl(UnitRepository unitRepository, DiaryRepository diaryRepository, OfficerRepository officerRepository) {
        this.unitRepository = unitRepository;
        this.diaryRepository = diaryRepository;
        this.officerRepository = officerRepository;
    }

    @Override
    public Unit save(Unit unit) {
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            return unitRepository.save(unit);
        }
        throw new BadRequestAlertException("Your account is not authorized to perform this action", null, null);
    }

    @Override
    public void delete(Long id) {
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            Diary diary = new Diary();
            diary.setContent("Delete unit");
            diary.setTime(ZonedDateTime.now());
            diaryRepository.save(diary);
            Unit unit = unitRepository.findById(id).orElseThrow(() -> new BadRequestAlertException("Can not found unit", null, null));
            List<Officer> officers = officerRepository.getAllByUnit(id);
            if (officers != null) {
                for (Officer officer : officers) {
                    Diary diaryOfficer = new Diary();
                    diaryOfficer.setContent("Đơn vị" + unit.getName() + " đã bị loại bỏ!");
                    diaryOfficer.setTime(ZonedDateTime.now());
                    diaryOfficer.setOfficer(officer);
                    diaryRepository.save(diaryOfficer);

                    officer.setUnit(null);
                    officerRepository.save(officer);
                }
            }
            unitRepository.delete(unit);
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
