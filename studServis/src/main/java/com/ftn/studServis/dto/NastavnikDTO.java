package com.ftn.studServis.dto;

public class NastavnikDTO {
    private Long id;
    private String ime;
    private String prezime;
    private String email;
    private String zvanje;
    private Long korisnikId;

    public NastavnikDTO() {}

    public NastavnikDTO(Long id, String ime, String prezime, String email, String zvanje, Long korisnikId) {
        this.id = id;
        this.ime = ime;
        this.prezime = prezime;
        this.email = email;
        this.zvanje = zvanje;
        this.korisnikId = korisnikId;
    }

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

    public Long getKorisnikId() { return korisnikId; }
    public void setKorisnikId(Long korisnikId) { this.korisnikId = korisnikId; }
}