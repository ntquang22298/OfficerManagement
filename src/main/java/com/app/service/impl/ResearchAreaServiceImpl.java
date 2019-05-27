package com.app.service.impl;

import com.app.repository.ResearchAreaRepository;
import com.app.service.ResearchAreaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ResearchAreaServiceImpl implements ResearchAreaService {

    private final Logger log = LoggerFactory.getLogger(ResearchAreaServiceImpl.class);
    private final ResearchAreaRepository researchAreaRepository;

    public ResearchAreaServiceImpl(ResearchAreaRepository researchAreaRepository) {
        this.researchAreaRepository = researchAreaRepository;
    }

    @Override
    public void delete(Long id) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

}
