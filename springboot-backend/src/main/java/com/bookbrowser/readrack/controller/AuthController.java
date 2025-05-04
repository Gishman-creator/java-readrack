package com.bookbrowser.readrack.controller;

import com.bookbrowser.readrack.dto.AdminDto;
import com.bookbrowser.readrack.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
