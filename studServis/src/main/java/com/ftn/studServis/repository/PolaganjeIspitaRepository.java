package com.ftn.studServis.repository;

import com.ftn.studServis.model.PolaganjeIspita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolaganjeIspitaRepository extends JpaRepository<PolaganjeIspita, Long> {
    List<PolaganjeIspita> findByStudentId(Long studentId);
    List<PolaganjeIspita> findByPredmetId(Long predmetId);
    List<PolaganjeIspita> findByStudentIdAndStatus(Long studentId, String status);
    @Query("SELECT DISTINCT p.ispitniRok FROM PolaganjeIspita p WHERE p.ispitniRok IS NOT NULL")
    List<String> findDistinctIspitniRokovi();

    List<PolaganjeIspita> findByIspitniRok(String ispitniRok);
    
}