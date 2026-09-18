package com.ftn.studServis.service.impl;

import com.ftn.studServis.dto.StudentDTO;
import com.ftn.studServis.model.Korisnik;
import com.ftn.studServis.model.Student;
import com.ftn.studServis.repository.KorisnikRepository;
import com.ftn.studServis.repository.StudentRepository;
import com.ftn.studServis.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private KorisnikRepository korisnikRepository;

    private StudentDTO convertToDTO(Student student) {
        return new StudentDTO(
            student.getId(),
            student.getBrojIndeksa(),
            student.getIme(),
            student.getPrezime(),
            student.getEmail(),
            student.getGodinaStudija(),
            student.getStanjeRacuna()
        );
    }

    private Student convertToEntity(StudentDTO dto) {
        Student student = new Student();
        student.setId(dto.getId());
        student.setBrojIndeksa(dto.getBrojIndeksa());
        student.setIme(dto.getIme());
        student.setPrezime(dto.getPrezime());
        student.setEmail(dto.getEmail());
        student.setGodinaStudija(dto.getGodinaStudija());
        student.setStanjeRacuna(dto.getStanjeRacuna() != null ? dto.getStanjeRacuna() : 0.0);
        return student;
    }

    @Override
    public List<StudentDTO> findAll() {
        return studentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDTO findById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student sa ID-jem " + id + " nije pronađen."));
        return convertToDTO(student);
    }
    
    @Override
    public StudentDTO findByKorisnikId(Long korisnikId) {
        Student student = studentRepository.findByKorisnikId(korisnikId)
                .orElseThrow(() -> new RuntimeException("Student nije pronađen za korisnika id: " + korisnikId));
        
        return convertToDTO(student);
    }

    @Override
    public StudentDTO save(StudentDTO studentDTO) {
        // 1. Automatski kreiramo korisnički nalog za novog studenta
        Korisnik korisnik = new Korisnik();
        korisnik.setUsername(studentDTO.getEmail()); // Koristimo email kao korisničko ime
        korisnik.setPassword("123456"); // Podrazumevana lozinka
        korisnik.setUloga("STUDENT"); // Postavljamo ulogu
        
        Korisnik savedKorisnik = korisnikRepository.save(korisnik);

        // 2. Kreiramo studenta i povezujemo ga sa sačuvanim korisnikom
        Student student = convertToEntity(studentDTO);
        student.setKorisnik(savedKorisnik); // Povezivanje preko ID-ja

        Student savedStudent = studentRepository.save(student);
        return convertToDTO(savedStudent);
    }

    @Override
    public StudentDTO update(Long id, StudentDTO studentDTO) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student nije pronađen."));

        student.setBrojIndeksa(studentDTO.getBrojIndeksa());
        student.setIme(studentDTO.getIme());
        student.setPrezime(studentDTO.getPrezime());
        student.setEmail(studentDTO.getEmail());
        student.setGodinaStudija(studentDTO.getGodinaStudija());
        if (studentDTO.getStanjeRacuna() != null) {
            student.setStanjeRacuna(studentDTO.getStanjeRacuna());
        }

        return convertToDTO(studentRepository.save(student));
    }

    @Override
    public void delete(Long id) {
        studentRepository.deleteById(id);
    }
    
    @Override
    public List<StudentDTO> findByBrojIndeksaContainingIgnoreCase(String brojIndeksa) {
        return studentRepository.findByBrojIndeksaContainingIgnoreCase(brojIndeksa).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}