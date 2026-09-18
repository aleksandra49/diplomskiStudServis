package com.ftn.studServis.repository;

import com.ftn.studServis.model.PolaganjeIspita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolaganjeIspitaRepository extends JpaRepository<PolaganjeIspita, Long> {
    List<PolaganjeIspita> findByStudentId(Long studentId);
    List<PolaganjeIspita> findByPredmetId(Long predmetId);
    List<PolaganjeIspita> findByStudentIdAndStatus(Long studentId, String status);
    
}