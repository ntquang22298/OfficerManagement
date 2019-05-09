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
 * A ConcernArea.
 */
@Entity
@Table(name = "concern_area")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ConcernArea implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "parent")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<ConcernArea> childs = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties("childs")
    private ConcernArea parent;

    @ManyToMany(mappedBy = "concernAreas")
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

    public ConcernArea name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<ConcernArea> getChilds() {
        return childs;
    }

    public ConcernArea childs(Set<ConcernArea> concernAreas) {
        this.childs = concernAreas;
        return this;
    }

    public ConcernArea addChilds(ConcernArea concernArea) {
        this.childs.add(concernArea);
        concernArea.setParent(this);
        return this;
    }

    public ConcernArea removeChilds(ConcernArea concernArea) {
        this.childs.remove(concernArea);
        concernArea.setParent(null);
        return this;
    }

    public void setChilds(Set<ConcernArea> concernAreas) {
        this.childs = concernAreas;
    }

    public ConcernArea getParent() {
        return parent;
    }

    public ConcernArea parent(ConcernArea concernArea) {
        this.parent = concernArea;
        return this;
    }

    public void setParent(ConcernArea concernArea) {
        this.parent = concernArea;
    }

    public Set<Officer> getOfficers() {
        return officers;
    }

    public ConcernArea officers(Set<Officer> officers) {
        this.officers = officers;
        return this;
    }

    public ConcernArea addOfficers(Officer officer) {
        this.officers.add(officer);
        officer.getConcernAreas().add(this);
        return this;
    }

    public ConcernArea removeOfficers(Officer officer) {
        this.officers.remove(officer);
        officer.getConcernAreas().remove(this);
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
        if (!(o instanceof ConcernArea)) {
            return false;
        }
        return id != null && id.equals(((ConcernArea) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "ConcernArea{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
