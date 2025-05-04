package com.bookbrowser.readrack.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable // Indicates it can be embedded in another entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthorBookId implements Serializable { // Must implement Serializable for composite keys

    @Column(name = "author_id")
    private Long authorId;

    @Column(name = "book_id")
    private Long bookId;

    // equals() and hashCode() are CRUCIAL for composite keys
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AuthorBookId that = (AuthorBookId) o;
        return Objects.equals(authorId, that.authorId) &&
                Objects.equals(bookId, that.bookId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(authorId, bookId);
    }
}