package com.app.service.impl;

import com.app.domain.Diary;
import com.app.domain.Officer;
import com.app.domain.enumeration.OfficerDegree;
import com.app.domain.enumeration.OfficerType;
import com.app.repository.DiaryRepository;
import com.app.repository.OfficerRepository;
import com.app.security.AuthoritiesConstants;
import com.app.security.SecurityUtils;
import com.app.service.OfficerService;
import com.app.service.dto.OfficerDTO;
import com.app.service.mapper.OfficerMapper;
import com.app.web.rest.errors.BadRequestAlertException;
import java.time.ZonedDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
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
    private final OfficerMapper officerMapper;

    public OfficerServiceImpl(OfficerRepository officerRepository, DiaryRepository diaryRepository, OfficerMapper officerMapper) {
        this.officerRepository = officerRepository;
        this.diaryRepository = diaryRepository;
        this.officerMapper = officerMapper;
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
    public List<OfficerDTO> search(String key, OfficerDegree degree, OfficerType type) {
        if (degree == null && type == null && key != null) {
            return officerRepository.findAllByUnit(key).stream()
                    .map(officerMapper::toDto)
                    .collect(Collectors.toCollection(LinkedList::new));
        } else if (degree == null && type != null && key != null) {
            return officerRepository.findAllByUnitAndType(key, type).stream()
                    .map(officerMapper::toDto)
                    .collect(Collectors.toCollection(LinkedList::new));
        } else if (degree != null && type == null && key != null) {
            return officerRepository.findAllByUnitAndDegree(key, degree).stream()
                    .map(officerMapper::toDto)
                    .collect(Collectors.toCollection(LinkedList::new));
        } else if (degree != null && type != null && key == null) {
            return officerRepository.findAllByDegreeAndType(degree, type).stream()
                    .map(officerMapper::toDto)
                    .collect(Collectors.toCollection(LinkedList::new));
        } else if (degree != null && type == null && key == null) {
            return officerRepository.findAllByDegree(degree).stream()
                    .map(officerMapper::toDto)
                    .collect(Collectors.toCollection(LinkedList::new));
        } else if (degree == null && type != null && key == null) {
            return officerRepository.findAllByType(type).stream()
                    .map(officerMapper::toDto)
                    .collect(Collectors.toCollection(LinkedList::new));
        } else if (degree == null && type == null && key == null) {
            return this.findAll();
        }
        return officerRepository.search(key, degree, type).stream()
                .map(officerMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));

    }

    @Override
    public List<OfficerDTO> findAll() {
        return officerRepository.findAllWithEagerRelationships().stream()
                .map(officerMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    public OfficerDTO findOne(Long id) {

        return officerMapper.toDto(officerRepository.findOneWithEagerRelationships(id));
    }

    @Override
    public List<OfficerDTO> findByName(String key) {
                return officerRepository.findAllByName(key).stream()
                .map(officerMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    public Officer findByUser(Long id) {
        return officerRepository.findByUser(id);
    }

}
