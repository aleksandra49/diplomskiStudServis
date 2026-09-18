package com.ftn.studServis.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pohadjanja_predmeta")
public class PohadjanjePredmeta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "predmet_id", nullable = false)
    private Predmet predmet;

    private Integer skolskaGodina;

    public PohadjanjePredmeta() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Predmet getPredmet() { return predmet; }
    public void setPredmet(Predmet predmet) { this.predmet = predmet; }

    public Integer getSkolskaGodina() { return skolskaGodina; }
    public void setSkolskaGodina(Integer skolskaGodina) { this.skolskaGodina = skolskaGodina; }
}