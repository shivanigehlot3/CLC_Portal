package com.clcportal.controller;

import com.clcportal.model.Admin;
import com.clcportal.model.AdmissionOfficer;
import com.clcportal.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    //Admin Registration
    @PostMapping("/register")
    public ResponseEntity<String> registerAdmin(@RequestBody Admin admin) {
        adminService.registerAdmin(admin);
        return ResponseEntity.ok("Admin registered successfully!");
    }

    //Admin Login
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Admin loginRequest) {
        if (adminService.login(loginRequest.getUsername(), loginRequest.getPassword())) {
            return ResponseEntity.ok("Login successful!");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials!");
        }
    }

    //Add Admission Officer
    @PostMapping("/officer")
    public AdmissionOfficer addOfficer(@RequestBody AdmissionOfficer officer) {
        return adminService.addOfficer(officer);
    }

    //Remove Admission Officer
    @DeleteMapping("/officer/{id}")
    public String removeOfficer(@PathVariable Long id) {
        adminService.removeOfficer(id);
        return "Officer removed!";
    }

    //Get All Officers
    @GetMapping("/officers")
    public List<AdmissionOfficer> getAllOfficers() {
        return adminService.getAllOfficers();
    }
    
 // Admission Officer Registration
    @PostMapping("/officer/register")
    public ResponseEntity<String> registerOfficer(@RequestBody AdmissionOfficer officer) {
        adminService.registerOfficer(officer);
        return ResponseEntity.ok("Officer registered successfully!");
    }

    // Admission Officer Login
    @PostMapping("/officer/login")
    public ResponseEntity<String> officerLogin(@RequestBody AdmissionOfficer loginRequest) {
        boolean isAuthenticated = adminService.officerLogin(loginRequest.getUsername(), loginRequest.getPassword());
        if (isAuthenticated) {
            return ResponseEntity.ok("Officer login successful!");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid officer credentials!");
        }
    }

}
