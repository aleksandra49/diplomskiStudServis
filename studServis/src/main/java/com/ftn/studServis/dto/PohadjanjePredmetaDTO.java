package com.ftn.studServis.dto;

public class PohadjanjePredmetaDTO {
    private Long id;
    private Long studentId;
    private String studentIndeksIme;
    private Long predmetId;
    private String predmetNaziv;
    private Integer skolskaGodina;

    public PohadjanjePredmetaDTO() {}

    public PohadjanjePredmetaDTO(Long id, Long studentId, String studentIndeksIme, Long predmetId, String predmetNaziv, Integer skolskaGodina) {
        this.id = id;
        this.studentId = studentId;
        this.studentIndeksIme = studentIndeksIme;
        this.predmetId = predmetId;
        this.predmetNaziv = predmetNaziv;
        this.skolskaGodina = skolskaGodina;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentIndeksIme() { return studentIndeksIme; }
    public void setStudentIndeksIme(String studentIndeksIme) { this.studentIndeksIme = studentIndeksIme; }

    public Long getPredmetId() { return predmetId; }
    public void setPredmetId(Long predmetId) { this.predmetId = predmetId; }

    public String getPredmetNaziv() { return predmetNaziv; }
    public void setPredmetNaziv(String predmetNaziv) { this.predmetNaziv = predmetNaziv; }

    public Integer getSkolskaGodina() { return skolskaGodina; }
    public void setSkolskaGodina(Integer skolskaGodina) { this.skolskaGodina = skolskaGodina; }
}