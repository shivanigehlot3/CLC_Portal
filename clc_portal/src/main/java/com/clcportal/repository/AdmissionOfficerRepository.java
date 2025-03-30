package com.clcportal.repository;

import com.clcportal.model.AdmissionOfficer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdmissionOfficerRepository extends JpaRepository<AdmissionOfficer, Long> {
    
    Optional<AdmissionOfficer> findByUsername(String username);
}
