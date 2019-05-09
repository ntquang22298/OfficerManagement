package com.app.service;

import com.app.domain.Unit;

public interface UnitService {
    Unit save(Unit unit);
    void delete(Long id);
}
