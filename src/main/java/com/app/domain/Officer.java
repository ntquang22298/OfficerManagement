package com.app.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import com.app.domain.enumeration.OfficerDegree;

import com.app.domain.enumeration.OfficerType;

/**
 * A Officer.
 */
@Entity
@Table(name = "officer")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Officer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "v_nu_email")
    private String vNUEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "jhi_degree")
    private OfficerDegree degree;

    @Enumerated(EnumType.STRING)
    @Column(name = "jhi_type")
    private OfficerType type;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "officer_research_areas",
               joinColumns = @JoinColumn(name = "officer_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "research_areas_id", referencedColumnName = "id"))
    private Set<ResearchArea> researchAreas = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "officer_concern_areas",
               joinColumns = @JoinColumn(name = "officer_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "concern_areas_id", referencedColumnName = "id"))
    private Set<ConcernArea> concernAreas = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties("officers")
    private Unit unit;

    @OneToMany(mappedBy = "officer")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Diary> diaries = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public Officer code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getFullName() {
        return fullName;
    }

    public Officer fullName(String fullName) {
        this.fullName = fullName;
        return this;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public Officer avatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
        return this;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getvNUEmail() {
        return vNUEmail;
    }

    public Officer vNUEmail(String vNUEmail) {
        this.vNUEmail = vNUEmail;
        return this;
    }

    public void setvNUEmail(String vNUEmail) {
        this.vNUEmail = vNUEmail;
    }

    public OfficerDegree getDegree() {
        return degree;
    }

    public Officer degree(OfficerDegree degree) {
        this.degree = degree;
        return this;
    }

    public void setDegree(OfficerDegree degree) {
        this.degree = degree;
    }

    public OfficerType getType() {
        return type;
    }

    public Officer type(OfficerType type) {
        this.type = type;
        return this;
    }

    public void setType(OfficerType type) {
        this.type = type;
    }

    public User getUser() {
        return user;
    }

    public Officer user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<ResearchArea> getResearchAreas() {
        return researchAreas;
    }

    public Officer researchAreas(Set<ResearchArea> researchAreas) {
        this.researchAreas = researchAreas;
        return this;
    }

    public Officer addResearchAreas(ResearchArea researchArea) {
        this.researchAreas.add(researchArea);
        researchArea.getOfficers().add(this);
        return this;
    }

    public Officer removeResearchAreas(ResearchArea researchArea) {
        this.researchAreas.remove(researchArea);
        researchArea.getOfficers().remove(this);
        return this;
    }

    public void setResearchAreas(Set<ResearchArea> researchAreas) {
        this.researchAreas = researchAreas;
    }

    public Set<ConcernArea> getConcernAreas() {
        return concernAreas;
    }

    public Officer concernAreas(Set<ConcernArea> concernAreas) {
        this.concernAreas = concernAreas;
        return this;
    }

    public Officer addConcernAreas(ConcernArea concernArea) {
        this.concernAreas.add(concernArea);
        concernArea.getOfficers().add(this);
        return this;
    }

    public Officer removeConcernAreas(ConcernArea concernArea) {
        this.concernAreas.remove(concernArea);
        concernArea.getOfficers().remove(this);
        return this;
    }

    public void setConcernAreas(Set<ConcernArea> concernAreas) {
        this.concernAreas = concernAreas;
    }

    public Unit getUnit() {
        return unit;
    }

    public Officer unit(Unit unit) {
        this.unit = unit;
        return this;
    }

    public void setUnit(Unit unit) {
        this.unit = unit;
    }

    public Set<Diary> getDiaries() {
        return diaries;
    }

    public Officer diaries(Set<Diary> diaries) {
        this.diaries = diaries;
        return this;
    }

    public Officer addDiaries(Diary diary) {
        this.diaries.add(diary);
        diary.setOfficer(this);
        return this;
    }

    public Officer removeDiaries(Diary diary) {
        this.diaries.remove(diary);
        diary.setOfficer(null);
        return this;
    }

    public void setDiaries(Set<Diary> diaries) {
        this.diaries = diaries;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Officer)) {
            return false;
        }
        return id != null && id.equals(((Officer) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Officer{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", fullName='" + getFullName() + "'" +
            ", avatarUrl='" + getAvatarUrl() + "'" +
            ", vNUEmail='" + getvNUEmail() + "'" +
            ", degree='" + getDegree() + "'" +
            ", type='" + getType() + "'" +
            "}";
    }
}
