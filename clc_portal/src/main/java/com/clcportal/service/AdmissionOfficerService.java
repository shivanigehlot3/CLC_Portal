package com.clcportal.service;

import com.clcportal.model.AdmissionOfficer;
import com.clcportal.repository.AdmissionOfficerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdmissionOfficerService {

    @Autowired
    private AdmissionOfficerRepository admissionOfficerRepository;
    
    public AdmissionOfficer addOfficer(AdmissionOfficer officer) {
        return admissionOfficerRepository.save(officer);
    }

    public List<AdmissionOfficer> getAllOfficers() {
        return admissionOfficerRepository.findAll();
    }

    public Optional<AdmissionOfficer> getOfficerById(Long id) {
        return admissionOfficerRepository.findById(id);
    }

    public boolean deleteOfficer(Long id) {
    	if (admissionOfficerRepository.existsById(id)) {
            admissionOfficerRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public boolean officerLogin(String username, String password) {
        Optional<AdmissionOfficer> officer = admissionOfficerRepository.findByUsername(username);

        return officer.isPresent() && officer.get().getPassword().equals(password);
    }
}
