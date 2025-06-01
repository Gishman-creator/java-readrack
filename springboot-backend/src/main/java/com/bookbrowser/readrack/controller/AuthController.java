package com.bookbrowser.readrack.controller;

import com.bookbrowser.readrack.dto.AdminDto;
import com.bookbrowser.readrack.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AdminDto> signup(@RequestBody AdminDto adminDto) {
        AdminDto createdAdmin = authService.signup(adminDto);
        return new ResponseEntity<>(createdAdmin, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AdminDto> login(@RequestBody AdminDto adminDto) {
        AdminDto loggedInAdmin = authService.login(adminDto);
        return new ResponseEntity<>(loggedInAdmin, HttpStatus.OK);
    }

    @GetMapping("/verify")
    public ResponseEntity<Void> verifyToken(@RequestParam String token) {
        boolean isTokenExpired = authService.isTokenExpired(token);
        System.out.println("Is token expired: " + isTokenExpired);
        if (isTokenExpired) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> initiatePasswordReset(@RequestBody Map<String, String> request) {
        try {
            authService.initiatePasswordReset(request.get("email"));
            return ResponseEntity.ok("OTP sent to your email");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String otp = request.get("otp");
            String temporaryToken = authService.verifyOtp(email, otp);
            return ResponseEntity.ok(Map.of("token", temporaryToken));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");
            authService.resetPassword(token, newPassword);
            return ResponseEntity.ok("Password reset successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
