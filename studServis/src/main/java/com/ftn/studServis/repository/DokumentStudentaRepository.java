package com.ftn.studServis.repository;

import com.ftn.studServis.model.DokumentStudenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DokumentStudentaRepository extends JpaRepository<DokumentStudenta, Long> {
    List<DokumentStudenta> findByStudentId(Long studentId);
}