package com.clcportal.controller;

import com.clcportal.model.SeatMatrix;
import com.clcportal.service.SeatMatrixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seat-matrix")
public class SeatMatrixController {

    @Autowired
    private SeatMatrixService seatMatrixService;

    //Get all seat matrices
    @GetMapping
    public List<SeatMatrix> getAllSeats() {
        return seatMatrixService.getAllSeats();
    }

    //Get seat matrix by branch
    @GetMapping("/{branch}")
    public SeatMatrix getSeatsByBranch(@PathVariable String branch) {
        return seatMatrixService.getSeatsByBranch(branch);
    }

    //Update seat matrix
    @PutMapping("/{branch}")
    public SeatMatrix updateSeats(@PathVariable String branch, @RequestParam int filledSeats) {
        return seatMatrixService.updateSeats(branch, filledSeats);
    }

    //Add new seat matrix
    @PostMapping
    public SeatMatrix addSeatMatrix(@RequestBody SeatMatrix seatMatrix) {
        return seatMatrixService.addSeatMatrix(seatMatrix);
    }
}
