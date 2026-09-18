package com.ftn.studServis.service;

import com.ftn.studServis.dto.NastavnikDTO;
import com.ftn.studServis.dto.PredmetDTO;

import java.util.List;

public interface NastavnikService {
    List<NastavnikDTO> findAll();
    NastavnikDTO findById(Long id);
    NastavnikDTO save(NastavnikDTO nastavnikDTO);
    void delete(Long id);
    NastavnikDTO findByKorisnikId(Long korisnikId);
    List<PredmetDTO> findPredmetiByNastavnikId(Long nastavnikId);
}