package com.ftn.studServis.repository;

import com.ftn.studServis.model.Korisnik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KorisnikRepository extends JpaRepository<Korisnik, Long> {
    Optional<Korisnik> findByUsername(String username);
    Boolean existsByUsername(String username);
}