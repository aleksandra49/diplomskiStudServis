package com.ftn.studServis.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "dokumenti_studenata")
public class DokumentStudenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String naziv;

    private String tipDokumenta; // PDF, DOCX...
    private String urlDokumenta;
    private LocalDate datumOtpremanja;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    public DokumentStudenta() {}

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

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
}