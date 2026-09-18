package com.ftn.studServis.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "polaganja_ispita")
public class PolaganjeIspita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "predmet_id", nullable = false)
    private Predmet predmet;

    private String ispitniRok; // npr. "Januarski 2026"
    private LocalDate datumPrijave;
    
    private Integer bodovi = 0; // Bodovi sa predrokovnih obaveza / ispita
    private Integer ocena; // 5 - 10

    @Column(nullable = false)
    private String status; // PRIJAVLJEN, POLOŽIO, NIJE_POLOŽIO, ODJAVLJEN

    private Double cenaPrijave = 1000.0;

    public PolaganjeIspita() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Predmet getPredmet() { return predmet; }
    public void setPredmet(Predmet predmet) { this.predmet = predmet; }

    public String getIspitniRok() { return ispitniRok; }
    public void setIspitniRok(String ispitniRok) { this.ispitniRok = ispitniRok; }

    public LocalDate getDatumPrijave() { return datumPrijave; }
    public void setDatumPrijave(LocalDate datumPrijave) { this.datumPrijave = datumPrijave; }

    public Integer getBodovi() { return bodovi; }
    public void setBodovi(Integer bodovi) { this.bodovi = bodovi; }

    public Integer getOcena() { return ocena; }
    public void setOcena(Integer ocena) { this.ocena = ocena; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getCenaPrijave() { return cenaPrijave; }
    public void setCenaPrijave(Double cenaPrijave) { this.cenaPrijave = cenaPrijave; }
}