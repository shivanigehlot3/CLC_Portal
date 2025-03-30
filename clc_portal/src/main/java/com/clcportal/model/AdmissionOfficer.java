package com.clcportal.model;

import jakarta.persistence.*;

@Entity
@Table(name = "admission_officers")
public class AdmissionOfficer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long officerId;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String phoneNumber;

    public AdmissionOfficer() {
    }

    public AdmissionOfficer(Long officerId, String username, String password, String name, String email, String phoneNumber) {
        this.officerId = officerId;
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    public Long getOfficerId() {
        return officerId;
    }

    public void setOfficerId(Long officerId) {
        this.officerId = officerId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    @Override
    public String toString() {
        return "AdmissionOfficer{" +
                "officerId=" + officerId +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                '}';
    }
}
