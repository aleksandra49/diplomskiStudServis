package com.ftn.studServis.repository;

import com.ftn.studServis.model.Nastavnik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NastavnikRepository extends JpaRepository<Nastavnik, Long> {
    Optional<Nastavnik> findByEmail(String email);
    Optional<Nastavnik> findByKorisnikId(Long korisnikId);
}