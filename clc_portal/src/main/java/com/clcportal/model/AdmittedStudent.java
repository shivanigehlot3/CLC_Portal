package com.clcportal.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "admitted_students")
public class AdmittedStudent {

	@Id
    private String rollNumber;
    private String name;
    private String email;
    private LocalDate admissionDate;

    public AdmittedStudent(String rollNumber, String name, String email, LocalDate admissionDate) {
        this.rollNumber = rollNumber;
        this.name = name;
        this.email = email;
        this.admissionDate = admissionDate;
    }
}