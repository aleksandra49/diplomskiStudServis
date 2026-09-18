package com.ftn.studServis.controller;

import com.ftn.studServis.dto.PredavanjePredmetaDTO; // Prilagodi naziv DTO-a ako se drugačije zove
import com.ftn.studServis.service.PredavanjePredmetaService; // Ili odgovarajući servis
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/predavanja")
@CrossOrigin(origins = "*")
public class PredavanjePredmetaController {

    @Autowired
    private PredavanjePredmetaService predavanjePredmetaService;

    @PostMapping
    public ResponseEntity<?> save(@RequestBody PredavanjePredmetaDTO dto) {
        return ResponseEntity.ok(predavanjePredmetaService.save(dto));
    }

    @GetMapping("/nastavnik/{nastavnikId}")
    public ResponseEntity<List<PredavanjePredmetaDTO>> getByNastavnik(@PathVariable Long nastavnikId) {
        return ResponseEntity.ok(predavanjePredmetaService.findByNastavnikId(nastavnikId));
    }
    
    @GetMapping("/predmet/{predmetId}")
    public ResponseEntity<List<PredavanjePredmetaDTO>> getByPredmet(@PathVariable Long predmetId) {
        return ResponseEntity.ok(predavanjePredmetaService.findByPredmetId(predmetId));
    }
    
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        predavanjePredmetaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}