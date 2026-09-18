package com.ftn.studServis.dto;

public class UnosOceneDTO {
    private Long polaganjeIspitaId;
    private Integer bodovi;
    private Integer ocena;

    public UnosOceneDTO() {}

    public UnosOceneDTO(Long polaganjeIspitaId, Integer bodovi, Integer ocena) {
        this.polaganjeIspitaId = polaganjeIspitaId;
        this.bodovi = bodovi;
        this.ocena = ocena;
    }

    public Long getPolaganjeIspitaId() { return polaganjeIspitaId; }
    public void setPolaganjeIspitaId(Long polaganjeIspitaId) { this.polaganjeIspitaId = polaganjeIspitaId; }

    public Integer getBodovi() { return bodovi; }
    public void setBodovi(Integer bodovi) { this.bodovi = bodovi; }

    public Integer getOcena() { return ocena; }
    public void setOcena(Integer ocena) { this.ocena = ocena; }
}