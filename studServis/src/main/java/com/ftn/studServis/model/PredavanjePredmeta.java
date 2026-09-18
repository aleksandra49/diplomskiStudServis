package com.ftn.studServis.model;

import jakarta.persistence.*;

@Entity
@Table(name = "predavanja_predmeta")
public class PredavanjePredmeta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "nastavnik_id", nullable = false)
    private Nastavnik nastavnik;

    @ManyToOne
    @JoinColumn(name = "predmet_id", nullable = false)
    private Predmet predmet;

    @Column(nullable = false)
    private String ulogaNaPredmetu; // NASTAVNIK, ASISTENT, DEMONSTRATOR

    public PredavanjePredmeta() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Nastavnik getNastavnik() { return nastavnik; }
    public void setNastavnik(Nastavnik nastavnik) { this.nastavnik = nastavnik; }

    public Predmet getPredmet() { return predmet; }
    public void setPredmet(Predmet predmet) { this.predmet = predmet; }

    public String getUlogaNaPredmetu() { return ulogaNaPredmetu; }
    public void setUlogaNaPredmetu(String ulogaNaPredmetu) { this.ulogaNaPredmetu = ulogaNaPredmetu; }
}