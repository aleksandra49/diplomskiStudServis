package com.ftn.studServis.service.impl;

import com.ftn.studServis.dto.PohadjanjePredmetaDTO;
import com.ftn.studServis.model.PohadjanjePredmeta;
import com.ftn.studServis.model.PredavanjePredmeta; 
import com.ftn.studServis.model.Predmet;
import com.ftn.studServis.model.Student;
import com.ftn.studServis.repository.PohadjanjePredmetaRepository;
import com.ftn.studServis.repository.PredavanjePredmetaRepository; 
import com.ftn.studServis.repository.PredmetRepository;
import com.ftn.studServis.repository.StudentRepository;
import com.ftn.studServis.service.PohadjanjePredmetaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PohadjanjePredmetaServiceImpl implements PohadjanjePredmetaService {

    @Autowired
    private PohadjanjePredmetaRepository pohadjanjeRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PredmetRepository predmetRepository;

    @Autowired
    private PredavanjePredmetaRepository predavanjePredmetaRepository; 

    private PohadjanjePredmetaDTO convertToDTO(PohadjanjePredmeta p) {
        String studentInfo = p.getStudent().getBrojIndeksa() + " " + p.getStudent().getIme() + " " + p.getStudent().getPrezime();
        
        // 1. Pronađemo profesora/nastavnika za dati predmet
        String profesorImePrezime = "Nije naznačen";
        List<PredavanjePredmeta> predavanja = predavanjePredmetaRepository.findByPredmetId(p.getPredmet().getId());
        if (predavanja != null && !predavanja.isEmpty()) {
            PredavanjePredmeta prvoPredavanje = predavanja.get(0);
            if (prvoPredavanje.getNastavnik() != null) {
                profesorImePrezime = prvoPredavanje.getNastavnik().getIme() + " " + prvoPredavanje.getNastavnik().getPrezime();
            }
        }

        // 2. Vraćamo DTO sa novim konstruktorom (7 argumenata)
        return new PohadjanjePredmetaDTO(
            p.getId(),
            p.getStudent().getId(),
            studentInfo,
            p.getPredmet().getId(),
            p.getPredmet().getNaziv(),
            p.getSkolskaGodina(),
            profesorImePrezime 
        );
    }

    @Override
    public List<PohadjanjePredmetaDTO> findByStudentId(Long studentId) {
        return pohadjanjeRepository.findByStudentId(studentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PohadjanjePredmetaDTO> findByPredmetId(Long predmetId) {
        return pohadjanjeRepository.findByPredmetId(predmetId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PohadjanjePredmetaDTO save(PohadjanjePredmetaDTO dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student nije pronađen."));
        Predmet predmet = predmetRepository.findById(dto.getPredmetId())
                .orElseThrow(() -> new RuntimeException("Predmet nije pronađen."));

        PohadjanjePredmeta p = new PohadjanjePredmeta();
        p.setId(dto.getId());
        p.setStudent(student);
        p.setPredmet(predmet);
        
        if (dto.getSkolskaGodina() == null) {
            p.setSkolskaGodina(2026);
        } else {
            p.setSkolskaGodina(dto.getSkolskaGodina());
        }

        return convertToDTO(pohadjanjeRepository.save(p));
    }
    
    @Override
    public void delete(Long id) {
        pohadjanjeRepository.deleteById(id);
    }
}