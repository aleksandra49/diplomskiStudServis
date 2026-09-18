package com.ftn.studServis.repository;

import com.ftn.studServis.model.FinansijskaKarticaTransakcija;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FinansijskaKarticaTransakcijaRepository extends JpaRepository<FinansijskaKarticaTransakcija, Long> {
    List<FinansijskaKarticaTransakcija> findByStudentId(Long studentId);
}