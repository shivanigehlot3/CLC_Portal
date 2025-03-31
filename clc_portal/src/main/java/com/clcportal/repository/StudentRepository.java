package com.clcportal.repository;

import com.clcportal.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Student findByName(String name);

    Optional<Student> findByRollNumber(String rollNumber);

    List<Student> findTop15ByOrderByRankAsc();

    List<Student> findByBranchOrderByRankAsc(String branch);
    List<Student> findByBranchAndAdmittedFalse(String branch);
    List<Student> findByAdmittedTrue();


    @Query(value = "SELECT * FROM student s WHERE s.documents_valid = true AND s.admitted = false ORDER BY s.rank ASC LIMIT 1", nativeQuery = true)
    Optional<Student> findEligibleStudent();
}
