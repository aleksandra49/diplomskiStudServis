package com.ftn.studServis.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "studenti")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String brojIndeksa;

    @Column(nullable = false)
    private String ime;

    @Column(nullable = false)
    private String prezime;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private Integer godinaStudija = 1;

    @Column(nullable = false)
    private Double stanjeRacuna = 0.0;

    @OneToOne
    @JoinColumn(name = "korisnik_id", referencedColumnName = "id")
    private Korisnik korisnik;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<PohadjanjePredmeta> pohadjanja = new ArrayList<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<PolaganjeIspita> polaganjaIspita = new ArrayList<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<FinansijskaKarticaTransakcija> transakcije = new ArrayList<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<DokumentStudenta> dokumenti = new ArrayList<>();

    public Student() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBrojIndeksa() { return brojIndeksa; }
    public void setBrojIndeksa(String brojIndeksa) { this.brojIndeksa = brojIndeksa; }

    public String getIme() { return ime; }
    public void setIme(String ime) { this.ime = ime; }

    public String getPrezime() { return prezime; }
    public void setPrezime(String prezime) { this.prezime = prezime; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getGodinaStudija() { return godinaStudija; }
    public void setGodinaStudija(Integer godinaStudija) { this.godinaStudija = godinaStudija; }

    public Double getStanjeRacuna() { return stanjeRacuna; }
    public void setStanjeRacuna(Double stanjeRacuna) { this.stanjeRacuna = stanjeRacuna; }

    public Korisnik getKorisnik() { return korisnik; }
    public void setKorisnik(Korisnik korisnik) { this.korisnik = korisnik; }

    public List<PohadjanjePredmeta> getPohadjanja() { return pohadjanja; }
    public void setPohadjanja(List<PohadjanjePredmeta> pohadjanja) { this.pohadjanja = pohadjanja; }

    public List<PolaganjeIspita> getPolaganjaIspita() { return polaganjaIspita; }
    public void setPolaganjaIspita(List<PolaganjeIspita> polaganjaIspita) { this.polaganjaIspita = polaganjaIspita; }

    public List<FinansijskaKarticaTransakcija> getTransakcije() { return transakcije; }
    public void setTransakcije(List<FinansijskaKarticaTransakcija> transakcije) { this.transakcije = transakcije; }

    public List<DokumentStudenta> getDokumenti() { return dokumenti; }
    public void setDokumenti(List<DokumentStudenta> dokumenti) { this.dokumenti = dokumenti; }
}