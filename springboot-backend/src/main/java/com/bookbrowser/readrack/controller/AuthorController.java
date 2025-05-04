package com.bookbrowser.readrack.controller;

import com.bookbrowser.readrack.dto.AuthorDto;
import com.bookbrowser.readrack.dto.AuthorSearchDto;
import com.bookbrowser.readrack.model.Author;
import com.bookbrowser.readrack.service.AuthorService;
// Import AuthorDto if you use it for request/response
// import com.bookbrowser.readrack.dto.AuthorDto;
import jakarta.validation.Valid; // For validating request bodies if annotations are used in Author model
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RequestMapping("/api/authors") // Base path for author endpoints
public class AuthorController {

    private final AuthorService authorService;

    @Autowired
    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    @PostMapping
    public ResponseEntity<Author> createAuthor(@Valid @RequestBody Author author) {
        // Consider using an AuthorDto for the request body
        Author createdAuthor = authorService.createAuthor(author);
        return new ResponseEntity<>(createdAuthor, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AuthorDto>> getAllAuthors() {
        List<AuthorDto> authors = authorService.getAllAuthorsDto();
        return ResponseEntity.ok(authors); // Or map to AuthorDto list
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuthorDto> getAuthorById(@PathVariable Long id) {
        AuthorDto author = authorService.getAuthorDtoById(id);
        return ResponseEntity.ok(author); // Or map to AuthorDto
    }

    @PutMapping("/{id}")
    public ResponseEntity<Author> updateAuthor(@PathVariable Long id, @Valid @RequestBody Author authorDetails) {
        // Consider AuthorDto here too
        Author updatedAuthor = authorService.updateAuthor(id, authorDetails);
        return ResponseEntity.ok(updatedAuthor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuthor(@PathVariable Long id) {
        authorService.deleteAuthor(id);
        return ResponseEntity.noContent().build(); // Standard response for successful delete
    }

    @GetMapping("/search")
    public ResponseEntity<List<AuthorSearchDto>> searchAuthors() {
        List<AuthorSearchDto> authors = authorService.getAllAuthorSearchDto();
        return ResponseEntity.ok(authors);
    }
}
