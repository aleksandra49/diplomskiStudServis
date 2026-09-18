package com.ftn.studServis.dto;

import java.time.LocalDateTime;

public class TransakcijaDTO {
    private Long id;
    private Long studentId;
    private String opis;
    private Double iznos;
    private LocalDateTime datum;
    private String tip;

    public TransakcijaDTO() {}

    public TransakcijaDTO(Long id, Long studentId, String opis, Double iznos, LocalDateTime datum, String tip) {
        this.id = id;
        this.studentId = studentId;
        this.opis = opis;
        this.iznos = iznos;
        this.datum = datum;
        this.tip = tip;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }

    public Double getIznos() { return iznos; }
    public void setIznos(Double iznos) { this.iznos = iznos; }

    public LocalDateTime getDatum() { return datum; }
    public void setDatum(LocalDateTime datum) { this.datum = datum; }

    public String getTip() { return tip; }
    public void setTip(String tip) { this.tip = tip; }
}