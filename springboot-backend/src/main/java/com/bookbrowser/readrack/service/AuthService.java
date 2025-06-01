package com.bookbrowser.readrack.service;

import com.bookbrowser.readrack.dto.AdminDto;
import com.bookbrowser.readrack.model.Admin;
import com.bookbrowser.readrack.repository.AdminRepository;
import com.bookbrowser.readrack.service.email.EmailService;
import com.bookbrowser.readrack.repository.PasswordResetTokenRepository;
import com.bookbrowser.readrack.model.PasswordResetToken;
import com.bookbrowser.readrack.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.security.authentication.BadCredentialsException;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${jwt.secret}")
    private String jwtSecret;

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

    public boolean isTokenExpired(String token) {
        return jwtUtil.isTokenExpired(token);
    }

    @Transactional
    public void initiatePasswordReset(String email) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User with email not found"));

        // Delete any existing tokens for this email
        passwordResetTokenRepository.deleteByEmail(email);

        String fullToken = jwtUtil.generateToken(email); // Generate JWT token
        String otp = String.format("%06d", new java.util.Random().nextInt(999999)); // Generate a 6-digit OTP
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(10); // Token valid for 10 minutes

        // Store both the full token and OTP
        PasswordResetToken resetToken = new PasswordResetToken(fullToken, otp, email, expiryDate);
        passwordResetTokenRepository.save(resetToken);

        String subject = "Password Reset Request";
        String text = "To reset your password, use the following OTP: " + otp + "\n\nThis OTP is valid for 10 minutes.";
        emailService.sendSimpleMessage(email, subject, text);
    }

    public String verifyOtp(String email, String otp) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or OTP"));

        if (!resetToken.getOtp().equals(otp)) {
            throw new IllegalArgumentException("Invalid email or OTP");
        }

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            passwordResetTokenRepository.delete(resetToken);
            throw new IllegalArgumentException("OTP has expired");
        }

        // OTP is valid, return the full JWT token
        return resetToken.getToken();
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        String email = jwtUtil.extractUsername(token); // Assuming the temporary token contains the email as subject

        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Validate the temporary token
        if (jwtUtil.isTokenExpired(token)) {
             throw new IllegalArgumentException("Invalid or expired token");
        }

        admin.setPassword(passwordEncoder.encode(newPassword));
        adminRepository.save(admin);

        // Invalidate the password reset token
        passwordResetTokenRepository.deleteByEmail(email);
    }
}
