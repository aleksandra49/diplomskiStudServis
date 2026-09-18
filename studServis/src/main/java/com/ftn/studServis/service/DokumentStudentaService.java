package com.ftn.studServis.service;

import com.ftn.studServis.dto.DokumentStudentaDTO;
import java.util.List;

public interface DokumentStudentaService {
    List<DokumentStudentaDTO> findByStudentId(Long studentId);
    DokumentStudentaDTO save(DokumentStudentaDTO dto);
    void delete(Long id);
}