package com.bookbrowser.readrack.repository;

import com.bookbrowser.readrack.model.AuthorBook;
import com.bookbrowser.readrack.model.AuthorBookId;
import com.bookbrowser.readrack.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthorBookRepository extends JpaRepository<AuthorBook, AuthorBookId> {

    // Method to find all entries for a specific book
    List<AuthorBook> findByBook(Book book);

    // Method to delete all entries associated with a specific book (useful for updates/deletes)
    void deleteByBook(Book book); // JPA derived delete query

    // Optional: Find by Author
    // List<AuthorBook> findByAuthor(Author author);
}