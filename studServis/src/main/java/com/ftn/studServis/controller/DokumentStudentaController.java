package com.ftn.studServis.controller;

import com.ftn.studServis.dto.DokumentStudentaDTO;
import com.ftn.studServis.service.DokumentStudentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dokumenti")
@CrossOrigin(origins = "*")
public class DokumentStudentaController {

    @Autowired
    private DokumentStudentaService dokumentService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<DokumentStudentaDTO>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(dokumentService.findByStudentId(studentId));
    }

    @PostMapping
    public ResponseEntity<DokumentStudentaDTO> save(@RequestBody DokumentStudentaDTO dto) {
        return ResponseEntity.ok(dokumentService.save(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        dokumentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}