package com.ftn.studServis.service;

import com.ftn.studServis.dto.KorisnikDTO;
import java.util.List;

public interface KorisnikService {
    List<KorisnikDTO> findAll();
    KorisnikDTO findById(Long id);
    KorisnikDTO findByUsername(String username);
    void delete(Long id);
}