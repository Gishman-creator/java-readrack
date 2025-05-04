package com.bookbrowser.readrack.service;

import com.bookbrowser.readrack.dto.AdminDto;
import com.bookbrowser.readrack.model.Admin;
import com.bookbrowser.readrack.repository.AdminRepository;
import com.bookbrowser.readrack.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.security.authentication.BadCredentialsException;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AdminDto signup(AdminDto adminDto) {
        if (!adminDto.getPassword().equals(adminDto.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        Optional<Admin> existingAdmin = adminRepository.findByEmail(adminDto.getEmail());
        if (existingAdmin.isPresent()) {
            throw new IllegalArgumentException("Email is already in use");
        }

        Admin admin = new Admin();
        admin.setName(adminDto.getName());
        admin.setEmail(adminDto.getEmail());
        admin.setPassword(bCryptPasswordEncoder.encode(adminDto.getPassword()));
        admin.setRoles("ROLE_ADMIN");

        Admin savedAdmin = adminRepository.save(admin);

        String accessToken = jwtUtil.generateToken(savedAdmin.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(savedAdmin.getEmail());

        savedAdmin.setRefreshToken(refreshToken);
        adminRepository.save(savedAdmin);

        AdminDto savedAdminDto = new AdminDto();
        savedAdminDto.setName(savedAdmin.getName());
        savedAdminDto.setEmail(savedAdmin.getEmail());
        savedAdminDto.setAccessToken(accessToken);
        savedAdminDto.setRoles(savedAdmin.getRoles());

        return savedAdminDto;
    }

    public AdminDto login(AdminDto adminDto) {
        Admin admin = adminRepository.findByEmail(adminDto.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!bCryptPasswordEncoder.matches(adminDto.getPassword(), admin.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String accessToken = jwtUtil.generateToken(admin.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(admin.getEmail());

        admin.setRefreshToken(refreshToken);
        adminRepository.save(admin);

        AdminDto loggedInAdminDto = new AdminDto();
        loggedInAdminDto.setName(admin.getName());
        loggedInAdminDto.setEmail(admin.getEmail());
        loggedInAdminDto.setAccessToken(accessToken);

        return loggedInAdminDto;
    }
}
