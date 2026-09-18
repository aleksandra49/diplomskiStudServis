package com.ftn.studServis.service.impl;

import com.ftn.studServis.dto.TransakcijaDTO;
import com.ftn.studServis.model.FinansijskaKarticaTransakcija;
import com.ftn.studServis.model.Student;
import com.ftn.studServis.repository.FinansijskaKarticaTransakcijaRepository;
import com.ftn.studServis.repository.StudentRepository;
import com.ftn.studServis.service.TransakcijaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransakcijaServiceImpl implements TransakcijaService {

    @Autowired
    private FinansijskaKarticaTransakcijaRepository transakcijaRepository;

    @Autowired
    private StudentRepository studentRepository;

    private TransakcijaDTO convertToDTO(FinansijskaKarticaTransakcija t) {
        return new TransakcijaDTO(
            t.getId(),
            t.getStudent().getId(),
            t.getOpis(),
            t.getIznos(),
            t.getDatum(),
            t.getTip()
        );
    }

    @Override
    public List<TransakcijaDTO> findByStudentId(Long studentId) {
        return transakcijaRepository.findByStudentId(studentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TransakcijaDTO izvrsiUplatu(Long studentId, Double iznos, String opis) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student nije pronađen."));

        student.setStanjeRacuna(student.getStanjeRacuna() + iznos);
        studentRepository.save(student);

        FinansijskaKarticaTransakcija t = new FinansijskaKarticaTransakcija(
            student,
            opis != null ? opis : "Uplata na račun",
            iznos,
            LocalDateTime.now(),
            "UPLATA"
        );

        return convertToDTO(transakcijaRepository.save(t));
    }
}