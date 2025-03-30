package com.clcportal.repository;

import com.clcportal.model.AdmittedStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface AdmittedStudentRepository extends JpaRepository<AdmittedStudent, String> {
    List<AdmittedStudent> findAll();
}