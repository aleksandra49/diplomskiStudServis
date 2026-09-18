package com.ftn.studServis.dto;

import java.time.LocalDate;

public class UplataDTO {
    private Long id;
    private Long studentId;
    private Double iznos;
    private String opis;
    private String svrha;
    private LocalDate datum;

    public UplataDTO() {}

    public UplataDTO(Long id, Long studentId, Double iznos, String opis, LocalDate datum) {
        this.id = id;
        this.studentId = studentId;
        this.iznos = iznos;
        this.opis = opis;
        this.svrha = opis;
        this.datum = datum;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Double getIznos() { return iznos; }
    public void setIznos(Double iznos) { this.iznos = iznos; }

    public String getOpis() { return opis != null ? opis : svrha; }
    public void setOpis(String opis) { 
        this.opis = opis; 
        this.svrha = opis;
    }

    public String getSvrha() { return svrha != null ? svrha : opis; }
    public void setSvrha(String svrha) { 
        this.svrha = svrha; 
        this.opis = svrha;
    }

    public LocalDate getDatum() { return datum; }
    public void setDatum(LocalDate datum) { this.datum = datum; }
}