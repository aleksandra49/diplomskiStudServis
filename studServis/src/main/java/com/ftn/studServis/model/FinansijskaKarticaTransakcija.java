package com.ftn.studServis.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transakcije")
public class FinansijskaKarticaTransakcija {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private String opis; // "Uplata na račun", "Prijava ispita: Matematika"

    @Column(nullable = false)
    private Double iznos; // Pozitivno za uplate, negativno za skidanja

    private LocalDateTime datum = LocalDateTime.now();

    private String tip; // UPLATA, PRIJAVA_ISPITA, ODJAVA_ISPITA

    public FinansijskaKarticaTransakcija() {}

    public FinansijskaKarticaTransakcija(Student student, String opis, Double iznos, LocalDateTime datum, String tip) {
        this.student = student;
        this.opis = opis;
        this.iznos = iznos;
        this.datum = datum;
        this.tip = tip;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }

    public Double getIznos() { return iznos; }
    public void setIznos(Double iznos) { this.iznos = iznos; }

    public LocalDateTime getDatum() { return datum; }
    public void setDatum(LocalDateTime datum) { this.datum = datum; }

    public String getTip() { return tip; }
    public void setTip(String tip) { this.tip = tip; }
}