package com.ftn.studServis.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "uplate")
public class Uplata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double iznos;

    @Column(nullable = false)
    private String svrha;

    @Column(nullable = false)
    private LocalDate datum;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    public Uplata() {}

    public Uplata(Double iznos, String svrha, LocalDate datum, Student student) {
        this.iznos = iznos;
        this.svrha = svrha;
        this.datum = datum;
        this.student = student;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getIznos() { return iznos; }
    public void setIznos(Double iznos) { this.iznos = iznos; }

    public String getSvrha() { return svrha; }
    public void setSvrha(String svrha) { this.svrha = svrha; }

    public LocalDate getDatum() { return datum; }
    public void setDatum(LocalDate datum) { this.datum = datum; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
}