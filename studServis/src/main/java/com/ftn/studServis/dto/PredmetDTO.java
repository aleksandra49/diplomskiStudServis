package com.ftn.studServis.dto;

public class PredmetDTO {
    private Long id;
    private String naziv;
    private Integer espb;
    private Integer semestar;

    public PredmetDTO() {}

    public PredmetDTO(Long id, String naziv, Integer espb, Integer semestar) {
        this.id = id;
        this.naziv = naziv;
        this.espb = espb;
        this.semestar = semestar;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNaziv() { return naziv; }
    public void setNaziv(String naziv) { this.naziv = naziv; }

    public Integer getEspb() { return espb; }
    public void setEspb(Integer espb) { this.espb = espb; }

    public Integer getSemestar() { return semestar; }
    public void setSemestar(Integer semestar) { this.semestar = semestar; }
}