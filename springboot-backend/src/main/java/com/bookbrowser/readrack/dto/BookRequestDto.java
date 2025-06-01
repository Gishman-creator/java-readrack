package com.bookbrowser.readrack.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class BookRequestDto {

    @NotEmpty(message = "Book name cannot be empty")
    private String name;

    private Integer readers;

    private String description;

    private String imageUrl;

    private String bookUrl;

    @NotNull(message = "Author IDs must be provided")
    @Size(min = 1, message = "At least one author ID is required")
    private List<Long> authorIds; // Array of Author IDs
}
