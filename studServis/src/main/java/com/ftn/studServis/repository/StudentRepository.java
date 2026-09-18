package com.ftn.studServis.repository;

import com.ftn.studServis.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByBrojIndeksa(String brojIndeksa);
    Boolean existsByBrojIndeksa(String brojIndeksa);
    Optional<Student> findByKorisnikId(Long korisnikId);
    List<Student> findByBrojIndeksaContainingIgnoreCase(String brojIndeksa);
}