package com.ftn.studServis.dto;

import java.time.LocalDate;

public class DokumentStudentaDTO {
    private Long id;
    private String naziv;
    private String tipDokumenta;
    private String urlDokumenta;
    private LocalDate datumOtpremanja;
    private Long studentId;

    public DokumentStudentaDTO() {}

    public DokumentStudentaDTO(Long id, String naziv, String tipDokumenta, String urlDokumenta, LocalDate datumOtpremanja, Long studentId) {
        this.id = id;
        this.naziv = naziv;
        this.tipDokumenta = tipDokumenta;
        this.urlDokumenta = urlDokumenta;
        this.datumOtpremanja = datumOtpremanja;
        this.studentId = studentId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNaziv() { return naziv; }
    public void setNaziv(String naziv) { this.naziv = naziv; }

    public String getTipDokumenta() { return tipDokumenta; }
    public void setTipDokumenta(String tipDokumenta) { this.tipDokumenta = tipDokumenta; }

    public String getUrlDokumenta() { return urlDokumenta; }
    public void setUrlDokumenta(String urlDokumenta) { this.urlDokumenta = urlDokumenta; }

    public LocalDate getDatumOtpremanja() { return datumOtpremanja; }
    public void setDatumOtpremanja(LocalDate datumOtpremanja) { this.datumOtpremanja = datumOtpremanja; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
}