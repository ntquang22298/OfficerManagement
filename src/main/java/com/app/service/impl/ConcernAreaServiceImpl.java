package com.app.service.impl;

import com.app.domain.ConcernArea;
import com.app.domain.Officer;
import com.app.repository.ConcernAreaRepository;
import com.app.service.ConcernAreaService;
import com.app.service.OfficerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ConcernAreaServiceImpl implements ConcernAreaService {

    private final Logger log = LoggerFactory.getLogger(ConcernAreaServiceImpl.class);
    private final ConcernAreaRepository concernAreaRepository;
    private final OfficerService officerService;

    public ConcernAreaServiceImpl(ConcernAreaRepository concernAreaRepository, OfficerService officerService) {
        this.concernAreaRepository = concernAreaRepository;
        this.officerService = officerService;
    }

    @Override
    public ConcernArea save(ConcernArea concernArea) {
        Officer officer = officerService.findByUser();
        concernArea.addOfficers(officer);
        return concernAreaRepository.save(concernArea);
    }

}
