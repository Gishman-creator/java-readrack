package com.bookbrowser.readrack.model;

import com.bookbrowser.readrack.util.IdGenerator;
import jakarta.persistence.*;
import lombok.Getter;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor // JPA requires a no-arg constructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "bookId")
public class Book {

    @Id
    private Long bookId;

    @Column(nullable = false)
    private String name;

    private Integer readers; // Number of readers

    @Column(length = 2000)
    private String description;

    private String imageUrl;

    private String bookUrl;

    // Defines the relationship back to the AuthorBook join table
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<AuthorBook> authorBooks = new HashSet<>();


    public Book(String name, Integer readers, String description) {
        this.name = name;
        this.readers = readers;
        this.description = description;
    }

    @PrePersist // Generate ID before saving
    private void ensureId(){
        if (this.bookId == null) {
            this.bookId = IdGenerator.generateRandom10DigitId();
            // Optional: Add collision check if needed
        }
    }

    // Convenience methods (optional)
    public void addAuthorBook(AuthorBook authorBook) {
        authorBooks.add(authorBook);
        authorBook.setBook(this);
    }

    public void removeAuthorBook(AuthorBook authorBook) {
        authorBooks.remove(authorBook);
        authorBook.setBook(null);
    }

    // Custom equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Book )) return false;
        return bookId != null && bookId.equals(((Book) o).getBookId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
