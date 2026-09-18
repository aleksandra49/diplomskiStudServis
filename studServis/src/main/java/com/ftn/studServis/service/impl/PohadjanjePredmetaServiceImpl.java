package com.ftn.studServis.service.impl;

import com.ftn.studServis.dto.PohadjanjePredmetaDTO;
import com.ftn.studServis.model.PohadjanjePredmeta;
import com.ftn.studServis.model.Predmet;
import com.ftn.studServis.model.Student;
import com.ftn.studServis.repository.PohadjanjePredmetaRepository;
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

    private PohadjanjePredmetaDTO convertToDTO(PohadjanjePredmeta p) {
        String studentInfo = p.getStudent().getBrojIndeksa() + " " + p.getStudent().getIme() + " " + p.getStudent().getPrezime();
        return new PohadjanjePredmetaDTO(
            p.getId(),
            p.getStudent().getId(),
            studentInfo,
            p.getPredmet().getId(),
            p.getPredmet().getNaziv(),
            p.getSkolskaGodina()
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
        
        // Ako školska godina nije poslata ili je null, postavljamo tekuću godinu kao ceo broj (npr. 2026)
        if (dto.getSkolskaGodina() == null) {
            p.setSkolskaGodina(2026); // Trenutna godina
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