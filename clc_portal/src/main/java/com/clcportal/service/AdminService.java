package com.clcportal.service;

import com.clcportal.model.Admin;
import com.clcportal.model.AdmissionOfficer;
import com.clcportal.repository.AdminRepository;
import com.clcportal.repository.AdmissionOfficerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private AdmissionOfficerRepository officerRepository;

    public boolean login(String username, String password) {
        Admin admin = adminRepository.findByUsername(username);
        return admin != null && admin.getPassword().equals(password);
    }

    public AdmissionOfficer addOfficer(AdmissionOfficer officer) {
        return officerRepository.save(officer);
    }

    public void removeOfficer(Long officerId) {
        officerRepository.deleteById(officerId);
    }

    public List<AdmissionOfficer> getAllOfficers() {
        return officerRepository.findAll();
    }
    
    public Admin registerAdmin(Admin admin) {
        return adminRepository.save(admin);
    }
    
    public AdmissionOfficer registerOfficer(AdmissionOfficer officer) {
        return officerRepository.save(officer);
    }

    public boolean officerLogin(String username, String password) {
        Optional<AdmissionOfficer> optionalOfficer = officerRepository.findByUsername(username);

        if (optionalOfficer.isPresent()) {
            AdmissionOfficer officer = optionalOfficer.get();
            return officer.getPassword().equals(password);
        }
        return false;
    }

}
