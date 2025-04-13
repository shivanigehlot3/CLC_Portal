package com.clcportal.model;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;


@Entity
public class SeatMatrix {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String branch;
    private int totalSeats;
    private int filledSeats;

    public SeatMatrix() {}

    public SeatMatrix(String branch, int totalSeats, int filledSeats) {
        this.branch = branch;
        this.totalSeats = totalSeats;
        this.filledSeats = filledSeats;
    }

    public Long getId() {
        return id;
    }

    public String getBranch() {
        return branch;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public int getFilledSeats() {
        return filledSeats;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }

    public void setFilledSeats(int filledSeats) {
        this.filledSeats = filledSeats;
    }

    @Override
    public String toString() {
        return "SeatMatrix{" +
                "id=" + id +
                ", branch='" + branch + '\'' +
                ", totalSeats=" + totalSeats +
                ", filledSeats=" + filledSeats +
                '}';
    }
}
