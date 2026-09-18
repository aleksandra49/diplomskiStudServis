package com.ftn.studServis.service;

import com.ftn.studServis.dto.StudentDTO;
import com.ftn.studServis.model.Student;

import java.util.List;
import java.util.Optional;

public interface StudentService {
    List<StudentDTO> findAll();
    StudentDTO findById(Long id);
    StudentDTO save(StudentDTO studentDTO);
    StudentDTO update(Long id, StudentDTO studentDTO);
    void delete(Long id);
    StudentDTO findByKorisnikId(Long korisnikId);
    //Optional<Student> findByKorisnikId(Long korisnikId);
    List<StudentDTO> findByBrojIndeksaContainingIgnoreCase(String brojIndeksa);
}