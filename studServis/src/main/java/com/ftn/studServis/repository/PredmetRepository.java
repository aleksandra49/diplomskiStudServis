package com.ftn.studServis.repository;

import com.ftn.studServis.model.Predmet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PredmetRepository extends JpaRepository<Predmet, Long> {
    List<Predmet> findBySemestar(Integer semestar);
}