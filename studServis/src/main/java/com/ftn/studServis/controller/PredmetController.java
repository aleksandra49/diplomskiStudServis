package com.ftn.studServis.controller;

import com.ftn.studServis.dto.PredmetDTO;
import com.ftn.studServis.service.PredmetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/predmeti")
@CrossOrigin(origins = "*")
public class PredmetController {

    @Autowired
    private PredmetService predmetService;

    @GetMapping
    public ResponseEntity<List<PredmetDTO>> getAll() {
        return ResponseEntity.ok(predmetService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PredmetDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(predmetService.findById(id));
    }

    @PostMapping
    public ResponseEntity<PredmetDTO> create(@RequestBody PredmetDTO predmetDTO) {
        return ResponseEntity.ok(predmetService.save(predmetDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        predmetService.delete(id);
        return ResponseEntity.noContent().build();
    }
}