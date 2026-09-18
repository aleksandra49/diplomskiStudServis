package com.ftn.studServis.controller;

import com.ftn.studServis.dto.NastavnikDTO;
import com.ftn.studServis.dto.PredmetDTO;
import com.ftn.studServis.service.NastavnikService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nastavnici")
@CrossOrigin(origins = "*")
public class NastavnikController {

    @Autowired
    private NastavnikService nastavnikService;

    @GetMapping
    public ResponseEntity<List<NastavnikDTO>> getAll() {
        return ResponseEntity.ok(nastavnikService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NastavnikDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(nastavnikService.findById(id));
    }
    
 // Pronalaženje nastavnika po ID-ju korisnika (korisnikId)
    @GetMapping("/korisnik/{korisnikId}")
    public ResponseEntity<NastavnikDTO> getByKorisnikId(@PathVariable Long korisnikId) {
        return ResponseEntity.ok(nastavnikService.findByKorisnikId(korisnikId));
    }

    // Pronalaženje predmeta koje nastavnik predaje
    @GetMapping("/{nastavnikId}/predmeti")
    public ResponseEntity<List<PredmetDTO>> getPredmetiByNastavnik(@PathVariable Long nastavnikId) {
        return ResponseEntity.ok(nastavnikService.findPredmetiByNastavnikId(nastavnikId));
    }

    @PostMapping
    public ResponseEntity<NastavnikDTO> create(@RequestBody NastavnikDTO nastavnikDTO) {
        return ResponseEntity.ok(nastavnikService.save(nastavnikDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        nastavnikService.delete(id);
        return ResponseEntity.noContent().build();
    }
}