package com.ftn.studServis.service.impl;

import com.ftn.studServis.dto.PolaganjeIspitaDTO;
import com.ftn.studServis.model.FinansijskaKarticaTransakcija;
import com.ftn.studServis.model.PolaganjeIspita;
import com.ftn.studServis.model.Predmet;
import com.ftn.studServis.model.Student;
import com.ftn.studServis.repository.FinansijskaKarticaTransakcijaRepository;
import com.ftn.studServis.repository.PolaganjeIspitaRepository;
import com.ftn.studServis.repository.PredmetRepository;
import com.ftn.studServis.repository.StudentRepository;
import com.ftn.studServis.service.PolaganjeIspitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PolaganjeIspitaServiceImpl implements PolaganjeIspitaService {

    @Autowired
    private PolaganjeIspitaRepository polaganjeIspitaRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PredmetRepository predmetRepository;

    @Autowired
    private FinansijskaKarticaTransakcijaRepository transakcijaRepository;

    private PolaganjeIspitaDTO convertToDTO(PolaganjeIspita p) {
        return new PolaganjeIspitaDTO(
            p.getId(),
            p.getStudent().getId(),
            p.getStudent().getBrojIndeksa(),
            p.getPredmet().getId(),
            p.getPredmet().getNaziv(),
            p.getIspitniRok(),
            p.getDatumPrijave(),
            p.getBodovi(),
            p.getOcena(),
            p.getStatus(),
            p.getCenaPrijave()
        );
    }

    @Override
    public List<PolaganjeIspitaDTO> findAll() {
        return polaganjeIspitaRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PolaganjeIspitaDTO> findByStudentId(Long studentId) {
        return polaganjeIspitaRepository.findByStudentId(studentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PolaganjeIspitaDTO> findByPredmetId(Long predmetId) {
        return polaganjeIspitaRepository.findByPredmetId(predmetId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PolaganjeIspitaDTO prijavaIspita(Long studentId, Long predmetId, String ispitniRok) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student nije pronađen."));
        Predmet predmet = predmetRepository.findById(predmetId)
                .orElseThrow(() -> new RuntimeException("Predmet nije pronađen."));

        Double cena = 200.0;
        if (student.getStanjeRacuna() < cena) {
            throw new RuntimeException("Nedovoljno sredstava na računu za prijavu ispita!");
        }

        // Skida se novac sa računa studenta
        student.setStanjeRacuna(student.getStanjeRacuna() - cena);
        studentRepository.save(student);

        // Kreira se transakcija
        FinansijskaKarticaTransakcija t = new FinansijskaKarticaTransakcija(
            student,
            "Prijava ispita: " + predmet.getNaziv(),
            -cena,
            LocalDateTime.now(),
            "PRIJAVA_ISPITA"
        );
        transakcijaRepository.save(t);

        // Kreira se prijava ispita
        PolaganjeIspita p = new PolaganjeIspita();
        p.setStudent(student);
        p.setPredmet(predmet);
        p.setIspitniRok(ispitniRok);
        p.setDatumPrijave(LocalDate.now());
        p.setStatus("PRIJAVLJEN");
        p.setCenaPrijave(cena);

        return convertToDTO(polaganjeIspitaRepository.save(p));
    }
    
    @Override
    public void delete(Long id) {
        PolaganjeIspita polaganje = polaganjeIspitaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prijava ispita nije pronađena."));

        Student student = polaganje.getStudent();
        Double iznosPovracaja = 200.0;

        // Vraća se novac na račun studenta
        student.setStanjeRacuna(student.getStanjeRacuna() + iznosPovracaja);
        studentRepository.save(student);

        // Kreira se transakcija povraćaja sredstava
        FinansijskaKarticaTransakcija t = new FinansijskaKarticaTransakcija(
            student,
            "Odjava ispita: " + polaganje.getPredmet().getNaziv(),
            iznosPovracaja,
            LocalDateTime.now(),
            "ODJAVA_ISPITA"
        );
        transakcijaRepository.save(t);

        // Briše se prijava ispita
        polaganjeIspitaRepository.deleteById(id);
    }

    @Override
    public PolaganjeIspitaDTO unesiOcenu(Long polaganjeId, Integer bodovi, Integer ocena) {
        PolaganjeIspita p = polaganjeIspitaRepository.findById(polaganjeId)
                .orElseThrow(() -> new RuntimeException("Prijava ispita nije pronađena."));

        p.setBodovi(bodovi);
        p.setOcena(ocena);
        // Umesto da odmah bude položio, stavljamo status da čeka odobrenje admina
        p.setStatus(ocena > 5 ? "ČEKA_ODOBRENJE" : "NIJE_POLOŽIO"); 

        return convertToDTO(polaganjeIspitaRepository.save(p));
    }
    
    @Override
    public PolaganjeIspitaDTO odobriOcenu(Long id) {
        PolaganjeIspita p = polaganjeIspitaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prijava ispita nije pronađena."));
        
        p.setStatus("POLOŽIO");
        return convertToDTO(polaganjeIspitaRepository.save(p));
    }
    
    @Override
    public List<String> findDistinctIspitniRokovi() {
        return polaganjeIspitaRepository.findDistinctIspitniRokovi();
    }

    @Override
    public List<PolaganjeIspitaDTO> findByIspitniRok(String ispitniRok) {
        return polaganjeIspitaRepository.findByIspitniRok(ispitniRok).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}