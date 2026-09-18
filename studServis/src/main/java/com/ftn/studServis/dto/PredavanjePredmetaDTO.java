package com.ftn.studServis.dto;

public class PredavanjePredmetaDTO {
    private Long id;
    private Long nastavnikId;
    private String nastavnikImePrezime;
    private Long predmetId;
    private String predmetNaziv;
    private String ulogaNaPredmetu;

    public PredavanjePredmetaDTO() {}

    public PredavanjePredmetaDTO(Long id, Long nastavnikId, String nastavnikImePrezime, Long predmetId, String predmetNaziv, String ulogaNaPredmetu) {
        this.id = id;
        this.nastavnikId = nastavnikId;
        this.nastavnikImePrezime = nastavnikImePrezime;
        this.predmetId = predmetId;
        this.predmetNaziv = predmetNaziv;
        this.ulogaNaPredmetu = ulogaNaPredmetu;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getNastavnikId() { return nastavnikId; }
    public void setNastavnikId(Long nastavnikId) { this.nastavnikId = nastavnikId; }

    public String getNastavnikImePrezime() { return nastavnikImePrezime; }
    public void setNastavnikImePrezime(String nastavnikImePrezime) { this.nastavnikImePrezime = nastavnikImePrezime; }

    public Long getPredmetId() { return predmetId; }
    public void setPredmetId(Long predmetId) { this.predmetId = predmetId; }

    public String getPredmetNaziv() { return predmetNaziv; }
    public void setPredmetNaziv(String predmetNaziv) { this.predmetNaziv = predmetNaziv; }

    public String getUlogaNaPredmetu() { return ulogaNaPredmetu; }
    public void setUlogaNaPredmetu(String ulogaNaPredmetu) { this.ulogaNaPredmetu = ulogaNaPredmetu; }
}