package com.ftn.studServis.dto;

import java.time.LocalDate;

public class PolaganjeIspitaDTO {
    private Long id;
    private Long studentId;
    private String studentIndeks;
    private Long predmetId;
    private String predmetNaziv;
    private String ispitniRok;
    private LocalDate datumPrijave;
    private Integer bodovi;
    private Integer ocena;
    private String status;
    private Double cenaPrijave;

    public PolaganjeIspitaDTO() {}

    public PolaganjeIspitaDTO(Long id, Long studentId, String studentIndeks, Long predmetId, String predmetNaziv, String ispitniRok, LocalDate datumPrijave, Integer bodovi, Integer ocena, String status, Double cenaPrijave) {
        this.id = id;
        this.studentId = studentId;
        this.studentIndeks = studentIndeks;
        this.predmetId = predmetId;
        this.predmetNaziv = predmetNaziv;
        this.ispitniRok = ispitniRok;
        this.datumPrijave = datumPrijave;
        this.bodovi = bodovi;
        this.ocena = ocena;
        this.status = status;
        this.cenaPrijave = cenaPrijave;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentIndeks() { return studentIndeks; }
    public void setStudentIndeks(String studentIndeks) { this.studentIndeks = studentIndeks; }

    public Long getPredmetId() { return predmetId; }
    public void setPredmetId(Long predmetId) { this.predmetId = predmetId; }

    public String getPredmetNaziv() { return predmetNaziv; }
    public void setPredmetNaziv(String predmetNaziv) { this.predmetNaziv = predmetNaziv; }

    public String getIspitniRok() { return ispitniRok; }
    public void setIspitniRok(String ispitniRok) { this.ispitniRok = ispitniRok; }

    public LocalDate getDatumPrijave() { return datumPrijave; }
    public void setDatumPrijave(LocalDate datumPrijave) { this.datumPrijave = datumPrijave; }

    public Integer getBodovi() { return bodovi; }
    public void setBodovi(Integer bodovi) { this.bodovi = bodovi; }

    public Integer getOcena() { return ocena; }
    public void setOcena(Integer ocena) { this.ocena = ocena; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getCenaPrijave() { return cenaPrijave; }
    public void setCenaPrijave(Double cenaPrijave) { this.cenaPrijave = cenaPrijave; }
}