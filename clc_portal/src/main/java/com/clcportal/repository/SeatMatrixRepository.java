package com.clcportal.repository;

import com.clcportal.model.SeatMatrix;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SeatMatrixRepository extends JpaRepository<SeatMatrix, Long> {
    Optional<SeatMatrix> findByBranch(String branch);
}
