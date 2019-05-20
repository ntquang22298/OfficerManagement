package com.app.service.mapper;

import com.app.domain.Officer;
import com.app.domain.Unit;
import com.app.service.dto.OfficerDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity Officer and its DTO OfficerDTO.
 */
@Mapper(componentModel = "spring", uses = {OfficerDTO.class})
public interface OfficerMapper extends EntityMapper<OfficerDTO, Officer> {
    @Mapping(source = "unit", target = "unit")
    @Mapping(source = "unit.name", target = "unitName")
    @Override
    OfficerDTO toDto(Officer officer);

    @Mapping(source = "unit", target = "unit")
    @Override
    Officer toEntity(OfficerDTO officerDTO);



    default Unit fromId(Long id) {
        if (id == null) {
            return null;
        }
        Unit unit = new Unit();
        unit.setId(id);
        return unit;
    }
}
