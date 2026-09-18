package com.ftn.studServis.controller;

import com.ftn.studServis.dto.TransakcijaDTO;
import com.ftn.studServis.dto.UplataDTO;
import com.ftn.studServis.service.TransakcijaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transakcije")
@CrossOrigin(origins = "*")
public class TransakcijaController {

    @Autowired
    private TransakcijaService transakcijaService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<TransakcijaDTO>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(transakcijaService.findByStudentId(studentId));
    }

    @PostMapping("/uplata")
    public ResponseEntity<TransakcijaDTO> izvrsiUplatu(@RequestBody UplataDTO uplataDTO) {
        return ResponseEntity.ok(transakcijaService.izvrsiUplatu(
                uplataDTO.getStudentId(),
                uplataDTO.getIznos(),
                uplataDTO.getOpis()
        ));
    }
}