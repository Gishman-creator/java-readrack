package com.bookbrowser.readrack.repository;

import com.bookbrowser.readrack.model.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {
    // Find authors by a list of IDs (useful for book creation/update)
    List<Author> findByAuthorIdIn(List<Long> authorIds);
}