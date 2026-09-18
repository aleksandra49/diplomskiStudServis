package com.ftn.studServis.service;

import com.ftn.studServis.dto.TransakcijaDTO;
import java.util.List;

public interface TransakcijaService {
    List<TransakcijaDTO> findByStudentId(Long studentId);
    TransakcijaDTO izvrsiUplatu(Long studentId, Double iznos, String opis);
}