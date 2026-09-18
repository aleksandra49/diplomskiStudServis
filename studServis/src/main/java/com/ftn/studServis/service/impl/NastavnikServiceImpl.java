package com.ftn.studServis.service.impl;

import com.ftn.studServis.dto.NastavnikDTO;
import com.ftn.studServis.dto.PredmetDTO;
import com.ftn.studServis.model.Korisnik;
import com.ftn.studServis.model.Nastavnik;
import com.ftn.studServis.repository.KorisnikRepository;
import com.ftn.studServis.repository.NastavnikRepository;
import com.ftn.studServis.service.NastavnikService;
import com.ftn.studServis.service.PredavanjePredmetaService; // <-- Ubaci ovaj servis
import com.ftn.studServis.service.PredmetService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NastavnikServiceImpl implements NastavnikService {

    @Autowired
    private NastavnikRepository nastavnikRepository;
    @Autowired
    private PredmetService predmetService;
    @Autowired
    private KorisnikRepository korisnikRepository;

    @Autowired
    private PredavanjePredmetaService predavanjePredmetaService; 

    private NastavnikDTO convertToDTO(Nastavnik n) {
        return new NastavnikDTO(
            n.getId(),
            n.getIme(),
            n.getPrezime(),
            n.getEmail(),
            n.getZvanje(),
            n.getKorisnik() != null ? n.getKorisnik().getId() : null
        );
    }

    @Override
    public List<NastavnikDTO> findAll() {
        return nastavnikRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public NastavnikDTO findById(Long id) {
        Nastavnik nastavnik = nastavnikRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nastavnik nije pronađen."));
        return convertToDTO(nastavnik);
    }

    @Override
    public NastavnikDTO save(NastavnikDTO nastavnikDTO) {
        // 1. Prvo kreiramo i čuvamo Korisnika za prijavu
        Korisnik korisnik = new Korisnik();
        // Možemo generisati username npr. od email-a ili imena/prezimena, ili ga proslediti iz DTO-a
        korisnik.setUsername(nastavnikDTO.getEmail()); 
        korisnik.setPassword("123456"); 
        korisnik.setUloga("NASTAVNIK");
        
        Korisnik sacuvanKorisnik = korisnikRepository.save(korisnik);

        // 2. Zatim kreiramo nastavnika i povezujemo ga sa sačuvanim korisnikom
        Nastavnik n = new Nastavnik();
        n.setIme(nastavnikDTO.getIme());
        n.setPrezime(nastavnikDTO.getPrezime());
        n.setEmail(nastavnikDTO.getEmail());
        n.setZvanje(nastavnikDTO.getZvanje());
        n.setKorisnik(sacuvanKorisnik); // Povezujemo relaciju

        Nastavnik sacuvanNastavnik = nastavnikRepository.save(n);
        return convertToDTO(sacuvanNastavnik);
    }

    @Override
    public void delete(Long id) {
        nastavnikRepository.deleteById(id);
    }

    @Override
    public NastavnikDTO findByKorisnikId(Long korisnikId) {
        Nastavnik nastavnik = nastavnikRepository.findByKorisnikId(korisnikId)
                .orElseThrow(() -> new RuntimeException("Nastavnik nije pronađen."));
        return convertToDTO(nastavnik);
    }

    @Override
    public List<PredmetDTO> findPredmetiByNastavnikId(Long nastavnikId) {
        return predavanjePredmetaService.findByNastavnikId(nastavnikId).stream()
                .map(p -> predmetService.findById(p.getPredmetId()))
                .collect(Collectors.toList());
    }
}