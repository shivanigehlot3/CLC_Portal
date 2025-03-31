package com.clcportal.service;

import org.hibernate.Hibernate;
import com.clcportal.model.Student;
import com.clcportal.model.SeatMatrix;
import com.clcportal.repository.StudentRepository;
import com.clcportal.repository.SeatMatrixRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.*;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SeatMatrixRepository seatMatrixRepository;

    @Autowired
    private JavaMailSender mailSender;
    public Student registerStudent(Student student) {
        if (studentRepository.findByRollNumber(student.getRollNumber()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Roll Number already registered!");
        }

        student.setStatus(calculateStatus(student));
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student loginStudent(String rollNumber, String password) {
        return studentRepository.findByRollNumber(rollNumber)
                .filter(student -> student.getPassword().equals(password))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
    }

    public Optional<Student> findByRollNumber(String rollNumber) {
        Optional<Student> studentOptional = studentRepository.findByRollNumber(rollNumber);

        studentOptional.ifPresent(student -> {
            Hibernate.initialize(student.getSeatMatrix());
        });

        return studentOptional;
    }
    
    public List<Student> getTop15Students() {
        return studentRepository.findTop15ByOrderByRankAsc();
    }

    public List<Student> getStudentsByBranch(String branch) {
        return studentRepository.findByBranchOrderByRankAsc(branch);
    }
 
    private static final Map<String, int[]> BRANCH_RANK_CRITERIA = new HashMap<>();

    static {
        BRANCH_RANK_CRITERIA.put("Engineering", new int[]{30, 50});
        BRANCH_RANK_CRITERIA.put("Management", new int[]{40, 60});
        BRANCH_RANK_CRITERIA.put("Forensic Science", new int[]{35, 55});
        BRANCH_RANK_CRITERIA.put("Law", new int[]{50, 70});
        BRANCH_RANK_CRITERIA.put("Mass Communication", new int[]{50, 70});
        BRANCH_RANK_CRITERIA.put("Pharmacy", new int[]{45, 65});
    }

    public String calculateStatus(Student student) {
        if (student.getBranch() == null || !BRANCH_RANK_CRITERIA.containsKey(student.getBranch())) {
            return "Not Qualified";
        }

        int rank = student.getRank();
        int[] thresholds = BRANCH_RANK_CRITERIA.get(student.getBranch());

        if (rank <= thresholds[0]) return "Qualified";
        if (rank <= thresholds[1]) return "Waitlisted";
        return "Not Qualified";
    }

    public Student updateStudent(String rollNumber, Student updatedStudent) {
        Student existingStudent = studentRepository.findByRollNumber(rollNumber)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
        
        Optional.ofNullable(updatedStudent.getName()).ifPresent(existingStudent::setName);
        Optional.ofNullable(updatedStudent.getEmail()).ifPresent(existingStudent::setEmail);
        Optional.ofNullable(updatedStudent.getPhoneNumber()).ifPresent(existingStudent::setPhoneNumber);
        Optional.ofNullable(updatedStudent.getAddress()).ifPresent(existingStudent::setAddress);
        Optional.ofNullable(updatedStudent.getFatherName()).ifPresent(existingStudent::setFatherName);
        Optional.ofNullable(updatedStudent.getDob()).ifPresent(existingStudent::setDob);
        Optional.ofNullable(updatedStudent.getBranch()).ifPresent(existingStudent::setBranch);
        Optional.ofNullable(updatedStudent.getRank()).ifPresent(existingStudent::setRank);

        if (updatedStudent.getBranch() != null || updatedStudent.getRank() != null) {
            existingStudent.setStatus(calculateStatus(existingStudent));
        }

        return studentRepository.save(existingStudent);
    }


    @Transactional
    public Student admitStudent(String rollNumber, String branch) {
        Student student = studentRepository.findByRollNumber(rollNumber)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        if (!student.getBranch().equalsIgnoreCase(branch)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot admit student from a different branch");
        }

        if (student.isAdmitted()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Student is already admitted");
        }

        if (!student.isDocumentsValid()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Documents are not valid");
        }

        SeatMatrix seatMatrix = seatMatrixRepository.findByBranch(branch)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Seat matrix not found"));

        if (seatMatrix.getFilledSeats() >= seatMatrix.getTotalSeats()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No vacant seats available");
        }

        student.setAdmitted(true);
        seatMatrix.setFilledSeats(seatMatrix.getFilledSeats() + 1);

        studentRepository.save(student);
        seatMatrixRepository.save(seatMatrix);

        return student;
    }

    public List<Student> getPendingStudentsByBranch(String branch) {
        return studentRepository.findByBranchAndAdmittedFalse(branch);
    }
    public int getStudentFilledSeats(String rollNumber) {
        Student student = studentRepository.findByRollNumber(rollNumber)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        SeatMatrix seatMatrix = student.getSeatMatrix();
        if (seatMatrix == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "SeatMatrix is not assigned for this student.");
        }

        return seatMatrix.getFilledSeats();
    }

    public Optional<Student> findNextEligibleStudent() {
        Optional<Student> student = studentRepository.findEligibleStudent();
        student.ifPresentOrElse(
            s -> System.out.println("Next eligible student found: " + s),
            () -> System.out.println("No eligible student found.")
        );
        return student;
    }
    
    public void save(Student student) {
        studentRepository.save(student);
    }
    
    public void sendNotification(String email, String message) {
        System.out.println("Sending email to " + email + ": " + message);
    
        /*
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(email);
        mailMessage.setSubject("Admission Update");
        mailMessage.setText(message);
        mailSender.send(mailMessage);
        */
    }
    
    
    public List<Student> getAdmittedStudents() {
        return studentRepository.findByAdmittedTrue();
    }

}
