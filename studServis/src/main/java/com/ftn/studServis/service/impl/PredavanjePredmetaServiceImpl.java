package com.ftn.studServis.service.impl;

import com.ftn.studServis.dto.PredavanjePredmetaDTO;
import com.ftn.studServis.model.Nastavnik;
import com.ftn.studServis.model.PredavanjePredmeta;
import com.ftn.studServis.model.Predmet;
import com.ftn.studServis.repository.NastavnikRepository;
import com.ftn.studServis.repository.PredavanjePredmetaRepository;
import com.ftn.studServis.repository.PredmetRepository;
import com.ftn.studServis.service.PredavanjePredmetaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PredavanjePredmetaServiceImpl implements PredavanjePredmetaService {

    @Autowired
    private PredavanjePredmetaRepository predavanjeRepository;

    @Autowired
    private NastavnikRepository nastavnikRepository;

    @Autowired
    private PredmetRepository predmetRepository;

    private PredavanjePredmetaDTO convertToDTO(PredavanjePredmeta p) {
        String nastavnikImePrezime = p.getNastavnik().getIme() + " " + p.getNastavnik().getPrezime();
        return new PredavanjePredmetaDTO(
            p.getId(),
            p.getNastavnik().getId(),
            nastavnikImePrezime,
            p.getPredmet().getId(),
            p.getPredmet().getNaziv(),
            p.getUlogaNaPredmetu()
        );
    }

    @Override
    public List<PredavanjePredmetaDTO> findByNastavnikId(Long nastavnikId) {
        return predavanjeRepository.findByNastavnikId(nastavnikId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PredavanjePredmetaDTO> findByPredmetId(Long predmetId) {
        return predavanjeRepository.findByPredmetId(predmetId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PredavanjePredmetaDTO save(PredavanjePredmetaDTO dto) {
        Nastavnik nastavnik = nastavnikRepository.findById(dto.getNastavnikId())
                .orElseThrow(() -> new RuntimeException("Nastavnik nije pronađen."));
        Predmet predmet = predmetRepository.findById(dto.getPredmetId())
                .orElseThrow(() -> new RuntimeException("Predmet nije pronađen."));

        PredavanjePredmeta p = new PredavanjePredmeta();
        p.setId(dto.getId());
        p.setNastavnik(nastavnik);
        p.setPredmet(predmet);
        p.setUlogaNaPredmetu(dto.getUlogaNaPredmetu());

        return convertToDTO(predavanjeRepository.save(p));
    }

    @Override
    public void delete(Long id) {
        predavanjeRepository.deleteById(id);
    }
}