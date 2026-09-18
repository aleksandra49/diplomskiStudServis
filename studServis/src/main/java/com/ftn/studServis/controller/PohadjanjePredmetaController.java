package com.ftn.studServis.controller;

import com.ftn.studServis.dto.PohadjanjePredmetaDTO;
import com.ftn.studServis.service.PohadjanjePredmetaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pohadjanja")
@CrossOrigin(origins = "*")
public class PohadjanjePredmetaController {

    @Autowired
    private PohadjanjePredmetaService pohadjanjeService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<PohadjanjePredmetaDTO>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(pohadjanjeService.findByStudentId(studentId));
    }

    @GetMapping("/predmet/{predmetId}")
    public ResponseEntity<List<PohadjanjePredmetaDTO>> getByPredmet(@PathVariable Long predmetId) {
        return ResponseEntity.ok(pohadjanjeService.findByPredmetId(predmetId));
    }

    @PostMapping
    public ResponseEntity<PohadjanjePredmetaDTO> save(@RequestBody PohadjanjePredmetaDTO dto) {
        return ResponseEntity.ok(pohadjanjeService.save(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        pohadjanjeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}