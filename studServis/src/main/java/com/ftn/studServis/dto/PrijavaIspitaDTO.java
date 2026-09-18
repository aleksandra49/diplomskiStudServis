package com.ftn.studServis.dto;

public class PrijavaIspitaDTO {
    private Long studentId;
    private Long predmetId;
    private String ispitniRok;

    public PrijavaIspitaDTO() {}

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getPredmetId() { return predmetId; }
    public void setPredmetId(Long predmetId) { this.predmetId = predmetId; }

    public String getIspitniRok() { return ispitniRok; }
    public void setIspitniRok(String ispitniRok) { this.ispitniRok = ispitniRok; }
}