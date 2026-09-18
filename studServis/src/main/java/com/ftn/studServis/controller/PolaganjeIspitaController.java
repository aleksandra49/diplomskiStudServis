package com.ftn.studServis.controller;

import com.ftn.studServis.dto.PolaganjeIspitaDTO;
import com.ftn.studServis.dto.PrijavaIspitaDTO;
import com.ftn.studServis.dto.UnosOceneDTO;
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
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> odjaviIspit(@PathVariable Long id) {
        polaganjeIspitaService.delete(id); // ili brisanje u servisu zavisno kako si nazvala metodu (npr. delete, odjaviIspit, itd.)
        return ResponseEntity.ok().build();
    }
}