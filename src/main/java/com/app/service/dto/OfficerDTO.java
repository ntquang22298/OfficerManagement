/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.app.service.dto;

import com.app.domain.ConcernArea;
import com.app.domain.Diary;
import com.app.domain.Officer;
import com.app.domain.ResearchArea;
import com.app.domain.Unit;
import com.app.domain.User;
import com.app.domain.enumeration.OfficerDegree;
import com.app.domain.enumeration.OfficerType;
import java.util.HashSet;
import java.util.Set;

/**
 *
 * @author Quang
 */
public class OfficerDTO {

    private Long id;
    private String code;
    private String fullName;
    private String avatarUrl;
    private String vNUEmail;
    private OfficerDegree degree;
    private OfficerType type;
    private User user;
    private Set<ResearchArea> researchAreas = new HashSet<>();
    private Set<ConcernArea> concernAreas = new HashSet<>();
    private Unit unit;
    private String unitName;

    public String getUnitName() {
        return unitName;
    }

    public void setUnitName(String unitName) {
        this.unitName = unitName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getvNUEmail() {
        return vNUEmail;
    }

    public void setvNUEmail(String vNUEmail) {
        this.vNUEmail = vNUEmail;
    }

    public OfficerDegree getDegree() {
        return degree;
    }

    public void setDegree(OfficerDegree degree) {
        this.degree = degree;
    }

    public OfficerType getType() {
        return type;
    }

    public void setType(OfficerType type) {
        this.type = type;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<ResearchArea> getResearchAreas() {
        return researchAreas;
    }

    public void setResearchAreas(Set<ResearchArea> researchAreas) {
        this.researchAreas = researchAreas;
    }

    public Set<ConcernArea> getConcernAreas() {
        return concernAreas;
    }

    public void setConcernAreas(Set<ConcernArea> concernAreas) {
        this.concernAreas = concernAreas;
    }

    public Unit getUnit() {
        return unit;
    }

    public void setUnit(Unit unit) {
        this.unit = unit;
    }
}
