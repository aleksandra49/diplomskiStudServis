package com.ftn.studServis.repository;

import com.ftn.studServis.model.PredavanjePredmeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PredavanjePredmetaRepository extends JpaRepository<PredavanjePredmeta, Long> {
    List<PredavanjePredmeta> findByNastavnikId(Long nastavnikId);
    List<PredavanjePredmeta> findByPredmetId(Long predmetId);
}