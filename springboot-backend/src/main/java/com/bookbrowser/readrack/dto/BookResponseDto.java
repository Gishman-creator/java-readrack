package com.bookbrowser.readrack.dto;

import lombok.Data;
import java.util.List;

@Data
public class BookResponseDto {
    private Long bookId;
    private String name;
    private Integer readers;
    private String description;
    // Include the list of associated authors with id and name
    private List<AuthorSummaryDto> authors;
}