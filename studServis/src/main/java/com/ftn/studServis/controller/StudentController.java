package com.ftn.studServis.controller;

import com.ftn.studServis.dto.StudentDTO;
import com.ftn.studServis.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/studenti")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAll() {
        return ResponseEntity.ok(studentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.findById(id));
    }
    
    @GetMapping("/korisnik/{korisnikId}")
    public ResponseEntity<StudentDTO> getByKorisnikId(@PathVariable Long korisnikId) {
        return ResponseEntity.ok(studentService.findByKorisnikId(korisnikId));
    }

    @PostMapping
    public ResponseEntity<StudentDTO> create(@RequestBody StudentDTO studentDTO) {
        return ResponseEntity.ok(studentService.save(studentDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> update(@PathVariable Long id, @RequestBody StudentDTO studentDTO) {
        return ResponseEntity.ok(studentService.update(id, studentDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        studentService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/pretraga/{indeks}")
    public ResponseEntity<List<StudentDTO>> getByBrojIndeksa(@PathVariable String indeks) {
        return ResponseEntity.ok(studentService.findByBrojIndeksaContainingIgnoreCase(indeks));
    }
}