package com.ftn.studServis.dto;

public class KorisnikDTO {
    private Long id;
    private String username;
    private String uloga;

    public KorisnikDTO() {}

    public KorisnikDTO(Long id, String username, String uloga) {
        this.id = id;
        this.username = username;
        this.uloga = uloga;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getUloga() { return uloga; }
    public void setUloga(String uloga) { this.uloga = uloga; }
}