package com.ftn.studServis.model;

import jakarta.persistence.*;

@Entity
@Table(name = "korisnici")
public class Korisnik {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String uloga; // ADMIN, NASTAVNIK, STUDENT

    public Korisnik() {}

    public Korisnik(String username, String password, String uloga) {
        this.username = username;
        this.password = password;
        this.uloga = uloga;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getUloga() { return uloga; }
    public void setUloga(String uloga) { this.uloga = uloga; }
}