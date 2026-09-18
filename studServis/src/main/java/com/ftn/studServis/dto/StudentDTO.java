package com.ftn.studServis.dto;

public class StudentDTO {
    private Long id;
    private String brojIndeksa;
    private String ime;
    private String prezime;
    private String email;
    private Integer godinaStudija;
    private Double stanjeRacuna;

    public StudentDTO() {}

    public StudentDTO(Long id, String brojIndeksa, String ime, String prezime, String email, Integer godinaStudija, Double stanjeRacuna) {
        this.id = id;
        this.brojIndeksa = brojIndeksa;
        this.ime = ime;
        this.prezime = prezime;
        this.email = email;
        this.godinaStudija = godinaStudija;
        this.stanjeRacuna = stanjeRacuna;
    }

    // Getters and Setters
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
}