package com.bookbrowser.readrack.model;

import com.bookbrowser.readrack.util.IdGenerator;
import jakarta.persistence.*;
import lombok.Getter;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Setter;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "authors")
@Getter
@Setter
@NoArgsConstructor // JPA requires a no-arg constructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "authorId")
public class Author {

    @Id
    private Long authorId;

    @Column(nullable = false)
    private String name;

    private LocalDate birthdate;

    @Column(length = 2000)
    private String bio;

    // Defines the relationship back to the AuthorBook join table
    // CascadeType.ALL means operations (persist, merge, remove, refresh, detach) on Author cascade to AuthorBook
    // orphanRemoval = true means if an AuthorBook is removed from this set, it gets deleted from the DB
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<AuthorBook> authorBooks = new HashSet<>();

    public Author(String name, LocalDate birthdate, String bio) {
        this.name = name;
        this.birthdate = birthdate;
        this.bio = bio;
    }

    @PrePersist // Method called before the entity is persisted (saved) for the first time
    private void ensureId(){
        if (this.authorId == null) {
            this.authorId = IdGenerator.generateRandom10DigitId();
            // Optional: Add logic here to check if the generated ID already exists
            // in the database and regenerate if necessary, though collisions are unlikely.
        }
    }

    // Convenience methods to manage the bidirectional relationship (optional but good practice)
    public void addAuthorBook(AuthorBook authorBook) {
        authorBooks.add(authorBook);
        authorBook.setAuthor(this);
    }

    public void removeAuthorBook(AuthorBook authorBook) {
        authorBooks.remove(authorBook);
        authorBook.setAuthor(null);
    }

    // Custom equals and hashCode based on ID are important for entity management
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Author )) return false;
        return authorId != null && authorId.equals(((Author) o).getAuthorId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode(); // Or use Objects.hash(authorId) if ID is always set post-persist
    }
}
