package com.ftn.studServis.controller;

import com.ftn.studServis.dto.PolaganjeIspitaDTO;
import com.ftn.studServis.dto.PrijavaIspitaDTO;
import com.ftn.studServis.dto.UnosOceneDTO;
import com.ftn.studServis.model.PolaganjeIspita;
import com.ftn.studServis.service.PolaganjeIspitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ispiti")
@CrossOrigin(origins = "*")
public class PolaganjeIspitaController {

    @Autowired
    private PolaganjeIspitaService polaganjeIspitaService;

    @GetMapping
    public ResponseEntity<List<PolaganjeIspitaDTO>> getAll() {
        return ResponseEntity.ok(polaganjeIspitaService.findAll());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<PolaganjeIspitaDTO>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(polaganjeIspitaService.findByStudentId(studentId));
    }

    @PostMapping("/prijava")
    public ResponseEntity<PolaganjeIspitaDTO> prijavaIspita(@RequestBody PrijavaIspitaDTO prijavaDTO) {
        return ResponseEntity.ok(polaganjeIspitaService.prijavaIspita(
                prijavaDTO.getStudentId(),
                prijavaDTO.getPredmetId(),
                prijavaDTO.getIspitniRok()
        ));
    }
    
    @GetMapping("/predmet/{predmetId}")
    public ResponseEntity<List<PolaganjeIspitaDTO>> getByPredmet(@PathVariable Long predmetId) {
        return ResponseEntity.ok(polaganjeIspitaService.findByPredmetId(predmetId));
    }

    @PutMapping("/ocena")
    public ResponseEntity<PolaganjeIspitaDTO> unesiOcenu(@RequestBody UnosOceneDTO unosOceneDTO) {
        return ResponseEntity.ok(polaganjeIspitaService.unesiOcenu(
                unosOceneDTO.getPolaganjeIspitaId(),
                unosOceneDTO.getBodovi(),
                unosOceneDTO.getOcena()
        ));
    }
    
    /*@PutMapping("/odobri/{id}")
    public ResponseEntity<PolaganjeIspitaDTO> odobriOcenu(@PathVariable Long id) {
        PolaganjeIspita p = polaganjeIspitaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prijava nije pronađena."));
        p.setStatus("POLOŽIO");
        return ResponseEntity.ok(convertToDTO(polaganjeIspitaRepository.save(p)));
    }*/
    
    @PutMapping("/odobri/{id}")
    public ResponseEntity<PolaganjeIspitaDTO> odobriOcenu(@PathVariable Long id) {
        return ResponseEntity.ok(polaganjeIspitaService.odobriOcenu(id));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> odjaviIspit(@PathVariable Long id) {
        polaganjeIspitaService.delete(id); // ili brisanje u servisu zavisno kako si nazvala metodu (npr. delete, odjaviIspit, itd.)
        return ResponseEntity.ok().build();
    }
    
 // 1. Vraća listu svih jedinstvenih naziva ispitnih rokova (npr. ["Januarski 2025", "Septembarski 2026"])
    @GetMapping("/rokovi/nazivi")
    public ResponseEntity<List<String>> getNaziviRokova() {
        return ResponseEntity.ok(polaganjeIspitaService.findDistinctIspitniRokovi());
    }

    // 2. Vraća sve prijave za izabrani ispitni rok
    @GetMapping("/rok/{nazivRoka}")
    public ResponseEntity<List<PolaganjeIspitaDTO>> getByIspitniRok(@PathVariable String nazivRoka) {
        return ResponseEntity.ok(polaganjeIspitaService.findByIspitniRok(nazivRoka));
    }
}