package com.ftn.studServis.service.impl;

import com.ftn.studServis.dto.DokumentStudentaDTO;
import com.ftn.studServis.model.DokumentStudenta;
import com.ftn.studServis.model.Student;
import com.ftn.studServis.repository.DokumentStudentaRepository;
import com.ftn.studServis.repository.StudentRepository;
import com.ftn.studServis.service.DokumentStudentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DokumentStudentaServiceImpl implements DokumentStudentaService {

    @Autowired
    private DokumentStudentaRepository dokumentRepository;

    @Autowired
    private StudentRepository studentRepository;

    private DokumentStudentaDTO convertToDTO(DokumentStudenta d) {
        return new DokumentStudentaDTO(
            d.getId(),
            d.getNaziv(),
            d.getTipDokumenta(),
            d.getUrlDokumenta(),
            d.getDatumOtpremanja(),
            d.getStudent().getId()
        );
    }

    @Override
    public List<DokumentStudentaDTO> findByStudentId(Long studentId) {
        return dokumentRepository.findByStudentId(studentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DokumentStudentaDTO save(DokumentStudentaDTO dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student nije pronađen."));

        DokumentStudenta d = new DokumentStudenta();
        d.setId(dto.getId());
        d.setNaziv(dto.getNaziv());
        d.setTipDokumenta(dto.getTipDokumenta());
        d.setUrlDokumenta(dto.getUrlDokumenta());
        d.setDatumOtpremanja(dto.getDatumOtpremanja() != null ? dto.getDatumOtpremanja() : LocalDate.now());
        d.setStudent(student);

        return convertToDTO(dokumentRepository.save(d));
    }

    @Override
    public void delete(Long id) {
        dokumentRepository.deleteById(id);
    }
}