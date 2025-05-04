package com.bookbrowser.readrack.dto;

public class AuthorSearchDto {
    private Long authorId;
    private String name;

    public AuthorSearchDto(Long authorId, String name) {
        this.authorId = authorId;
        this.name = name;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
