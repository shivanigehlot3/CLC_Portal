package com.clcportal.service;

import com.clcportal.model.SeatMatrix;
import com.clcportal.repository.SeatMatrixRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeatMatrixService {

    @Autowired
    private SeatMatrixRepository seatMatrixRepository;

    public List<SeatMatrix> getAllSeats() {
        return seatMatrixRepository.findAll();
    }

    public SeatMatrix getSeatsByBranch(String branch) {
        return seatMatrixRepository.findByBranch(branch)
                .orElseThrow(() -> new RuntimeException("Branch not found: " + branch));
    }

    public SeatMatrix updateSeats(String branch, int filledSeats) {
        SeatMatrix seatMatrix = getSeatsByBranch(branch);
        seatMatrix.setFilledSeats(filledSeats);
        return seatMatrixRepository.save(seatMatrix);
    }

    public SeatMatrix addSeatMatrix(SeatMatrix seatMatrix) {
        return seatMatrixRepository.save(seatMatrix);
    }
}
