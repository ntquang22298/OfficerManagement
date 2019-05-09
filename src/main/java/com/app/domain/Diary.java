package com.app.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A Diary.
 */
@Entity
@Table(name = "diary")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Diary implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "jhi_time")
    private ZonedDateTime time;

    @Column(name = "content")
    private String content;

    @ManyToOne
    @JsonIgnoreProperties("diaries")
    private Officer officer;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getTime() {
        return time;
    }

    public Diary time(ZonedDateTime time) {
        this.time = time;
        return this;
    }

    public void setTime(ZonedDateTime time) {
        this.time = time;
    }

    public String getContent() {
        return content;
    }

    public Diary content(String content) {
        this.content = content;
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Officer getOfficer() {
        return officer;
    }

    public Diary officer(Officer officer) {
        this.officer = officer;
        return this;
    }

    public void setOfficer(Officer officer) {
        this.officer = officer;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Diary)) {
            return false;
        }
        return id != null && id.equals(((Diary) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Diary{" +
            "id=" + getId() +
            ", time='" + getTime() + "'" +
            ", content='" + getContent() + "'" +
            "}";
    }
}
