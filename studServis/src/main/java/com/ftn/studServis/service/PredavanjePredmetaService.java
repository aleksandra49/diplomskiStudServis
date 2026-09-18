package com.ftn.studServis.service;

import com.ftn.studServis.dto.PredavanjePredmetaDTO;
import java.util.List;

public interface PredavanjePredmetaService {
    List<PredavanjePredmetaDTO> findByNastavnikId(Long nastavnikId);
    List<PredavanjePredmetaDTO> findByPredmetId(Long predmetId);
    PredavanjePredmetaDTO save(PredavanjePredmetaDTO dto);
    void delete(Long id);
}