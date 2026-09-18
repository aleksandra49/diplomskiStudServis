package com.ftn.studServis.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "nastavnici")
public class Nastavnik {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String ime;

    @Column(nullable = false)
    private String prezime;

    @Column(nullable = false, unique = true)
    private String email;

    private String zvanje; // Profesor, Docent, Asistent...

    @OneToOne
    @JoinColumn(name = "korisnik_id", referencedColumnName = "id")
    private Korisnik korisnik;

    @OneToMany(mappedBy = "nastavnik", cascade = CascadeType.ALL)
    private List<PredavanjePredmeta> predavanja = new ArrayList<>();

    public Nastavnik() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIme() { return ime; }
    public void setIme(String ime) { this.ime = ime; }

    public String getPrezime() { return prezime; }
    public void setPrezime(String prezime) { this.prezime = prezime; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getZvanje() { return zvanje; }
    public void setZvanje(String zvanje) { this.zvanje = zvanje; }

    public Korisnik getKorisnik() { return korisnik; }
    public void setKorisnik(Korisnik korisnik) { this.korisnik = korisnik; }

    public List<PredavanjePredmeta> getPredavanja() { return predavanja; }
    public void setPredavanja(List<PredavanjePredmeta> predavanja) { this.predavanja = predavanja; }
}