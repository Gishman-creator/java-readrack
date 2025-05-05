package com.bookbrowser.readrack.service;

import com.bookbrowser.readrack.dto.AuthorDto;
import com.bookbrowser.readrack.model.Author;
import com.bookbrowser.readrack.repository.AuthorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthorService {

    // Optional: Logger
    private static final Logger log = LoggerFactory.getLogger(AuthorService.class);

    private final AuthorRepository authorRepository;

    @Autowired
    public AuthorService(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    public Author createAuthor(Author author) {
        // ID generation happens via @PrePersist in the Author entity
        return authorRepository.save(author);
    }

    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    @Transactional
    public Author getAuthorById(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Author not found with id: " + id));
        Hibernate.initialize(author.getBio());
        return author;
    }

    public List<AuthorDto> getAllAuthorsDto() { // Return DTO list
        List<Author> authors = authorRepository.findAll();
        return authors.stream()
                .map(this::mapAuthorToDto) // Map each author
                .collect(Collectors.toList());
    }

    public AuthorDto getAuthorDtoById(Long id) { // Return single DTO
        Author author = getAuthorById(id); // Reuse existing method to find entity
        return mapAuthorToDto(author);
    }

    // Helper method to map Entity to DTO
    private AuthorDto mapAuthorToDto(Author author) {
        AuthorDto dto = new AuthorDto();
        dto.setAuthorId(author.getAuthorId());
        dto.setName(author.getName());
        dto.setBirthdate(author.getBirthdate());
        dto.setBio(author.getBio());
        dto.setImageUrl(author.getImageUrl());

        // Example: Populate book IDs (requires fetching AuthorBook or accessing Book)
        // This assumes author.getAuthorBooks() is accessible and populated.
        // Be mindful of lazy loading issues here - you might need a dedicated query
        // or ensure the collection is initialized within the transaction.
        if (author.getAuthorBooks() != null) {
            List<Long> bookIds = author.getAuthorBooks().stream()
                    .map(ab -> ab.getBook().getBookId()) // Get book ID from AuthorBook
                    .collect(Collectors.toList());
            dto.setBookIds(bookIds);
        } else {
            dto.setBookIds(new ArrayList<>()); // Or null, depending on desired output
        }

        return dto;
    }

    @Transactional
    public Author updateAuthor(Long id, Author authorDetails) {
        log.info("Got author: {}", authorDetails.getName());
        log.info("Got author: {}", authorDetails.getBirthdate());
        log.info("Got author: {}", authorDetails.getBio());
        Author existingAuthor = getAuthorById(id); // Reuse getById to handle not found case

        existingAuthor.setName(authorDetails.getName());
        existingAuthor.setBirthdate(authorDetails.getBirthdate());
        existingAuthor.setBio(authorDetails.getBio());
        existingAuthor.setImageUrl(authorDetails.getImageUrl());
        // ID should not be changed

        log.info("Updated author with ID: {}", existingAuthor.getAuthorId());

        return authorRepository.save(existingAuthor);
    }

    @Transactional
    public void deleteAuthor(Long id) {
        Author author = getAuthorById(id); // Check if exists first
        // Cascading delete should handle AuthorBook entries due to CascadeType.ALL and orphanRemoval=true
        authorRepository.delete(author);
    }

    public List<com.bookbrowser.readrack.dto.AuthorSearchDto> getAllAuthorSearchDto() {
        List<Author> authors = authorRepository.findAll();
        return authors.stream()
                .map(author -> new com.bookbrowser.readrack.dto.AuthorSearchDto(author.getAuthorId(), author.getName()))
                .collect(Collectors.toList());
    }
}
