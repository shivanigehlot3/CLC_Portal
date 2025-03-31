package com.clcportal.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Data
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

    @Column(unique = true, nullable = false)
    @JsonProperty("rollNumber")
    private String rollNumber;

    @Column(nullable = false)
    @JsonProperty("password")
    private String password;


    @JsonProperty("name")
    private String name;
    
    @Column(nullable = false) 
    @JsonProperty("branch")
    private String branch;
    
    @JsonProperty("rank")
    private Integer rank;
    
    @JsonProperty("email")
    private String email;
    
    @JsonProperty("phoneNumber")
    private String phoneNumber;
    
    @JsonProperty("address")
    private String address;
    
    @JsonProperty("fatherName")
    private String fatherName;
    
    @JsonProperty("dob")
    private LocalDate dob;
   

    @Column
    private String status;
    
    @Column(name = "documentsValid", nullable = false)
    @JsonProperty("documentsValid")
 private boolean documentsValid = false;
    
    @Column(name = "admitted", nullable = false)
    @JsonProperty("admitted")
 private boolean admitted = false;
    
    @ManyToOne
    @JoinColumn(name = "seat_matrix_id", referencedColumnName = "id") 
    private SeatMatrix seatMatrix;
    
    @Override
    public String toString() {
        return "Student{" +
                "studentId=" + studentId +
                ", rollNumber='" + rollNumber + '\'' +
                ", name='" + name + '\'' +
                ", branch='" + branch + '\'' +
                ", rank=" + rank +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", address='" + address + '\'' +
                ", fatherName='" + fatherName + '\'' +
//                ", standing='" + standing + '\'' +
                ", status='" + status + '\'' +
                ", dob=" + dob +
                '}';
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }
    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getFatherName() {
        return fatherName;
    }

    public void setFatherName(String fatherName) {
        this.fatherName = fatherName;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }
    
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    
    public boolean isDocumentsValid() {
        return documentsValid;
    }

    public void setDocumentsValid(boolean documentsValid) {
        this.documentsValid = documentsValid;
    }

    public SeatMatrix getSeatMatrix() {
        return seatMatrix;
    }

    public void setSeatMatrix(SeatMatrix seatMatrix) {
        this.seatMatrix = seatMatrix;
    }
    
    public boolean isAdmitted() {
      return admitted;
  }

  public void setAdmitted(boolean admitted) {
      this.admitted = admitted;
  }

}
