package com.ftn.studServis.repository;

import com.ftn.studServis.model.PohadjanjePredmeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PohadjanjePredmetaRepository extends JpaRepository<PohadjanjePredmeta, Long> {
    List<PohadjanjePredmeta> findByStudentId(Long studentId);
    List<PohadjanjePredmeta> findByPredmetId(Long predmetId);
}