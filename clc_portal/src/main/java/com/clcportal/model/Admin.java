package com.clcportal.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adminId;

    @Column(unique = true, nullable = false)
    private String username;

    private String password;

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}
