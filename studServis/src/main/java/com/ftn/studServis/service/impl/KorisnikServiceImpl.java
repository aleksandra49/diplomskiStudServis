package com.ftn.studServis.service.impl;

import com.ftn.studServis.dto.KorisnikDTO;
import com.ftn.studServis.model.Korisnik;
import com.ftn.studServis.repository.KorisnikRepository;
import com.ftn.studServis.service.KorisnikService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class KorisnikServiceImpl implements KorisnikService {

    @Autowired
    private KorisnikRepository korisnikRepository;

    private KorisnikDTO convertToDTO(Korisnik korisnik) {
        return new KorisnikDTO(
            korisnik.getId(),
            korisnik.getUsername(),
            korisnik.getUloga()
        );
    }

    @Override
    public List<KorisnikDTO> findAll() {
        return korisnikRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public KorisnikDTO findById(Long id) {
        Korisnik korisnik = korisnikRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen."));
        return convertToDTO(korisnik);
    }

    @Override
    public KorisnikDTO findByUsername(String username) {
        Korisnik korisnik = korisnikRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Korisnik sa korisničkim imenom " + username + " nije pronađen."));
        return convertToDTO(korisnik);
    }

    @Override
    public void delete(Long id) {
        korisnikRepository.deleteById(id);
    }
}