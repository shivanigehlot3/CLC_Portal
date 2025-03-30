package com.clcportal.model;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Transient;


@Entity
public class SeatMatrix {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String branch;
    private int totalSeats;
    private int filledSeats;

    @Transient 
    private int availableSeats;
    public SeatMatrix() {}

    public SeatMatrix(String branch, int totalSeats, int filledSeats) {
        this.branch = branch;
        this.totalSeats = totalSeats;
        this.filledSeats = filledSeats;
        this.availableSeats = totalSeats - filledSeats;
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

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
        calculateAvailableSeats();
    }

    public void setFilledSeats(int filledSeats) {
        this.filledSeats = filledSeats;
        calculateAvailableSeats();
    }
    private void calculateAvailableSeats() {
        this.availableSeats = this.totalSeats - this.filledSeats;
    }

    @Override
    public String toString() {
        return "SeatMatrix{" +
                "id=" + id +
                ", branch='" + branch + '\'' +
                ", totalSeats=" + totalSeats +
                ", filledSeats=" + filledSeats +
                ", availableSeats=" + getAvailableSeats() +
                '}';
    }
}
