package com.clcportal.controller;

import com.clcportal.model.AdmissionOfficer;
import com.clcportal.service.AdmissionOfficerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.clcportal.service.StudentService;
import com.clcportal.model.Student;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/officers")
public class AdmissionOfficerController {

    @Autowired
    private AdmissionOfficerService admissionOfficerService;
    
    @Autowired
    private StudentService studentService;


    //Add a new officer
    @PostMapping("/add")
    public ResponseEntity<AdmissionOfficer> addOfficer(@RequestBody AdmissionOfficer officer) {
        AdmissionOfficer savedOfficer = admissionOfficerService.addOfficer(officer);
        return ResponseEntity.ok(savedOfficer);
    }

    //Get all officers
    @GetMapping
    public ResponseEntity<List<AdmissionOfficer>> getAllOfficers() {
        List<AdmissionOfficer> officers = admissionOfficerService.getAllOfficers();
        return ResponseEntity.ok(officers);
    }

    //Get officer by ID
    @GetMapping("/{id}")
    public ResponseEntity<AdmissionOfficer> getOfficerById(@PathVariable Long id) {
        Optional<AdmissionOfficer> officer = admissionOfficerService.getOfficerById(id);
        return officer.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    //Delete officer by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOfficer(@PathVariable Long id) {
        boolean deleted = admissionOfficerService.deleteOfficer(id);

        if (deleted) {
            return ResponseEntity.ok("Officer deleted successfully!");
        } else {
            return ResponseEntity.status(404).body("Officer not found!");
        }
    }


    //Officer Login
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String username, @RequestParam String password) {
        boolean isAuthenticated = admissionOfficerService.officerLogin(username, password);
        if (isAuthenticated) {
            return ResponseEntity.ok("Login successful!");
        } else {
            return ResponseEntity.status(401).body("Invalid username or password.");
        }
    }
    
    @GetMapping("/next-student")
    public ResponseEntity<Student> getNextEligibleStudent() {
        Optional<Student> student = studentService.findNextEligibleStudent();

        return student.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.status(404).build()); // No body, just 404 status
    }

}
