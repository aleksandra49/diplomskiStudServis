package com.ftn.studServis.controller;

import com.ftn.studServis.dto.KorisnikDTO;
import com.ftn.studServis.dto.LoginDTO;
import com.ftn.studServis.model.Korisnik;
import com.ftn.studServis.repository.KorisnikRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private KorisnikRepository korisnikRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        Optional<Korisnik> korisnikOpt = korisnikRepository.findByUsername(loginDTO.getUsername());

        if (korisnikOpt.isPresent()) {
            Korisnik korisnik = korisnikOpt.get();
            // Provera lozinke
            if (korisnik.getPassword().equals(loginDTO.getPassword())) {
                KorisnikDTO korisnikDTO = new KorisnikDTO(
                    korisnik.getId(),
                    korisnik.getUsername(),
                    korisnik.getUloga()
                );
                return ResponseEntity.ok(korisnikDTO);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Neispravno korisničko ime ili lozinka.");
    }
}