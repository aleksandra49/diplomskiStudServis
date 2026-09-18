package com.ftn.studServis.service;

import com.ftn.studServis.dto.PolaganjeIspitaDTO;
import java.util.List;

public interface PolaganjeIspitaService {
    List<PolaganjeIspitaDTO> findAll();
    List<PolaganjeIspitaDTO> findByStudentId(Long studentId);
    List<PolaganjeIspitaDTO> findByPredmetId(Long predmetId);
    PolaganjeIspitaDTO prijavaIspita(Long studentId, Long predmetId, String ispitniRok);
    PolaganjeIspitaDTO unesiOcenu(Long polaganjeId, Integer bodovi, Integer ocena);
    void delete(Long id);
    List<String> findDistinctIspitniRokovi();
    List<PolaganjeIspitaDTO> findByIspitniRok(String ispitniRok);
    PolaganjeIspitaDTO odobriOcenu(Long id);
}