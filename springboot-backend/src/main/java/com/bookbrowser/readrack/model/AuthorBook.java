package com.bookbrowser.readrack.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@Entity
@Table(name = "author_book")
@Getter
@Setter
@NoArgsConstructor
public class AuthorBook {

    @EmbeddedId // Use the composite key class
    private AuthorBookId id;

    // Many-to-one relationship with Author
    // fetch = FetchType.LAZY is generally recommended for performance
    // insertable = false, updatable = false because the ID mapping handles it
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("authorId") // Maps the 'authorId' field of the AuthorBookId composite key
    @JoinColumn(name = "author_id", insertable = false, updatable = false)
    private Author author;

    // Many-to-one relationship with Book
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("bookId") // Maps the 'bookId' field of the AuthorBookId composite key
    @JoinColumn(name = "book_id", insertable = false, updatable = false)
    private Book book;

    // Constructor to easily create an instance
    public AuthorBook(Author author, Book book) {
        this.author = author;
        this.book = book;
        this.id = new AuthorBookId(author.getAuthorId(), book.getBookId());
    }

    // Custom equals and hashCode based on the composite ID
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AuthorBook that = (AuthorBook) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}