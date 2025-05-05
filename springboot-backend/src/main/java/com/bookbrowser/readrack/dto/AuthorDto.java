package com.bookbrowser.readrack.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List; // Or Set

@Data
public class AuthorDto {
    private Long authorId;
    private String name;
    private LocalDate birthdate;
    private String bio;
    private String imageUrl;
    // Optionally include basic info about books, like just the IDs or names
    private List<Long> bookIds; // Example: Just include book IDs
    // private List<String> bookNames; // Example: Just include book names
}
