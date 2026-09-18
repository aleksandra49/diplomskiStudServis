package com.ftn.studServis.service.impl;

import com.ftn.studServis.dto.PredmetDTO;
import com.ftn.studServis.model.Predmet;
import com.ftn.studServis.repository.PredmetRepository;
import com.ftn.studServis.service.PredmetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PredmetServiceImpl implements PredmetService {

    @Autowired
    private PredmetRepository predmetRepository;

    private PredmetDTO convertToDTO(Predmet predmet) {
        return new PredmetDTO(
            predmet.getId(),
            predmet.getNaziv(),
            predmet.getEspb(),
            predmet.getSemestar()
        );
    }

    private Predmet convertToEntity(PredmetDTO dto) {
        Predmet predmet = new Predmet();
        predmet.setId(dto.getId());
        predmet.setNaziv(dto.getNaziv());
        predmet.setEspb(dto.getEspb());
        predmet.setSemestar(dto.getSemestar());
        return predmet;
    }

    @Override
    public List<PredmetDTO> findAll() {
        return predmetRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PredmetDTO findById(Long id) {
        Predmet predmet = predmetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Predmet nije pronađen."));
        return convertToDTO(predmet);
    }

    @Override
    public PredmetDTO save(PredmetDTO predmetDTO) {
        Predmet predmet = convertToEntity(predmetDTO);
        return convertToDTO(predmetRepository.save(predmet));
    }

    @Override
    public void delete(Long id) {
        predmetRepository.deleteById(id);
    }
}