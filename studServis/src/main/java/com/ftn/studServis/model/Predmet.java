package com.ftn.studServis.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "predmeti")
public class Predmet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String naziv;

    @Column(nullable = false)
    private Integer espb;

    @Column(nullable = false)
    private Integer semestar;

    @OneToMany(mappedBy = "predmet", cascade = CascadeType.ALL)
    private List<PredavanjePredmeta> nastavnici = new ArrayList<>();

    @OneToMany(mappedBy = "predmet", cascade = CascadeType.ALL)
    private List<PohadjanjePredmeta> pohadjanja = new ArrayList<>();

    public Predmet() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNaziv() { return naziv; }
    public void setNaziv(String naziv) { this.naziv = naziv; }

    public Integer getEspb() { return espb; }
    public void setEspb(Integer espb) { this.espb = espb; }

    public Integer getSemestar() { return semestar; }
    public void setSemestar(Integer semestar) { this.semestar = semestar; }

    public List<PredavanjePredmeta> getNastavnici() { return nastavnici; }
    public void setNastavnici(List<PredavanjePredmeta> nastavnici) { this.nastavnici = nastavnici; }

    public List<PohadjanjePredmeta> getPohadjanja() { return pohadjanja; }
    public void setPohadjanja(List<PohadjanjePredmeta> pohadjanja) { this.pohadjanja = pohadjanja; }
}