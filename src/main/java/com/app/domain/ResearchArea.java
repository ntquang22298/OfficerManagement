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

/**
 * A ResearchArea.
 */
@Entity
@Table(name = "research_area")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ResearchArea implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "parent")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<ResearchArea> childs = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties("childs")
    private ResearchArea parent;

    @ManyToMany(mappedBy = "researchAreas")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<Officer> officers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public ResearchArea name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<ResearchArea> getChilds() {
        return childs;
    }

    public ResearchArea childs(Set<ResearchArea> researchAreas) {
        this.childs = researchAreas;
        return this;
    }

    public ResearchArea addChilds(ResearchArea researchArea) {
        this.childs.add(researchArea);
        researchArea.setParent(this);
        return this;
    }

    public ResearchArea removeChilds(ResearchArea researchArea) {
        this.childs.remove(researchArea);
        researchArea.setParent(null);
        return this;
    }

    public void setChilds(Set<ResearchArea> researchAreas) {
        this.childs = researchAreas;
    }

    public ResearchArea getParent() {
        return parent;
    }

    public ResearchArea parent(ResearchArea researchArea) {
        this.parent = researchArea;
        return this;
    }

    public void setParent(ResearchArea researchArea) {
        this.parent = researchArea;
    }

    public Set<Officer> getOfficers() {
        return officers;
    }

    public ResearchArea officers(Set<Officer> officers) {
        this.officers = officers;
        return this;
    }

    public ResearchArea addOfficers(Officer officer) {
        this.officers.add(officer);
        officer.getResearchAreas().add(this);
        return this;
    }

    public ResearchArea removeOfficers(Officer officer) {
        this.officers.remove(officer);
        officer.getResearchAreas().remove(this);
        return this;
    }

    public void setOfficers(Set<Officer> officers) {
        this.officers = officers;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ResearchArea)) {
            return false;
        }
        return id != null && id.equals(((ResearchArea) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "ResearchArea{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
