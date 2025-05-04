package com.bookbrowser.readrack.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor // Constructor for easy creation
public class AuthorSummaryDto {
    private Long authorId;
    private String name;
}