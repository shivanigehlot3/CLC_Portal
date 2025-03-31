package com.clcportal.controller;

import com.clcportal.model.Student;
import com.clcportal.model.AdmittedStudent;
import com.clcportal.repository.AdmittedStudentRepository;
import com.clcportal.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.time.LocalDate;


import java.util.Optional;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentService studentService;
    
    @Autowired
    private AdmittedStudentRepository admittedStudentRepository;

    @GetMapping("/test")
    public String testApp() {
        return "App is running!";
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerStudent(@RequestBody Student student) {
        System.out.println("Received Student: " + student);
        studentService.registerStudent(student);
        return ResponseEntity.ok("Student registered successfully!");
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginStudent(@RequestBody Student loginRequest) {
        Optional<Student> studentOptional = studentService.findByRollNumber(loginRequest.getRollNumber());

        if (studentOptional.isPresent()) {
            Student student = studentOptional.get();
            if (student.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.ok("Login successful!");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password.");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found.");
        }
    }

    @GetMapping("/top")
    public List<Student> getTopStudents() {
        List<Student> topStudents = studentService.getTop15Students();
        
        topStudents.forEach(student -> {
            if (student.getStatus() == null || student.getStatus().isEmpty()) {
                String status = studentService.calculateStatus(student);
                student.setStatus(status);
            }
        });

        return topStudents;
    }

    //Get students by branch
    @GetMapping("/branch/{branch}")
    public List<Student> getStudentsByBranch(@PathVariable String branch) {
        return studentService.getStudentsByBranch(branch);
    }

    //Get student by roll number
    @GetMapping("/{rollNumber}")
    public ResponseEntity<Student> getStudentByRollNumber(@PathVariable String rollNumber) {
        Optional<Student> studentOptional = studentService.findByRollNumber(rollNumber);
        return studentOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    //Update Student Details
    @PutMapping("/updateStudent/{rollNumber}")
    public Student updateStudent(@PathVariable String rollNumber, @RequestBody Student updatedStudent) {
    	 System.out.println("Updating student: " + rollNumber);
        return studentService.updateStudent(rollNumber, updatedStudent);
    }

    @GetMapping("/next-eligible")
    public ResponseEntity<Student> getNextEligibleStudent() {
        Optional<Student> nextStudent = studentService.findNextEligibleStudent();
        return nextStudent.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @PostMapping("/skip/{rollNumber}")
    public ResponseEntity<Student> skipStudent(@PathVariable String rollNumber) {
        Optional<Student> nextStudent = studentService.findNextEligibleStudent();
        return nextStudent.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    
    @GetMapping("/admitted")
    public ResponseEntity<List<Student>> getAdmittedStudents() {
        List<Student> admittedStudents = studentService.getAdmittedStudents();
        return ResponseEntity.ok(admittedStudents);
    }
   
    @PutMapping("/admit/{rollNumber}/{branch}")
    public ResponseEntity<?> admitStudent(@PathVariable String rollNumber, @PathVariable String branch) {
        Student admittedStudent = studentService.admitStudent(rollNumber, branch);
        return ResponseEntity.ok(admittedStudent);
    }

  
}
