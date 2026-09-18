package com.ftn.studServis.service;

import com.ftn.studServis.dto.PohadjanjePredmetaDTO;
import java.util.List;

public interface PohadjanjePredmetaService {
    List<PohadjanjePredmetaDTO> findByStudentId(Long studentId);
    List<PohadjanjePredmetaDTO> findByPredmetId(Long predmetId);
    PohadjanjePredmetaDTO save(PohadjanjePredmetaDTO dto);
    void delete(Long id);
}