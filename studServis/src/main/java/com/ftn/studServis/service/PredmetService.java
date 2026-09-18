package com.ftn.studServis.service;

import com.ftn.studServis.dto.PredmetDTO;
import java.util.List;

public interface PredmetService {
    List<PredmetDTO> findAll();
    PredmetDTO findById(Long id);
    PredmetDTO save(PredmetDTO predmetDTO);
    void delete(Long id);
}