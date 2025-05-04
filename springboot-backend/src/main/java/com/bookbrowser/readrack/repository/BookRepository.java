package com.bookbrowser.readrack.repository;

import com.bookbrowser.readrack.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByNameLikeIgnoreCase(String name);
    // Add custom query methods if needed
}