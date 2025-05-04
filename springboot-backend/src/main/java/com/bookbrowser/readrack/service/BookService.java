package com.bookbrowser.readrack.service;

import com.bookbrowser.readrack.dto.AuthorDto;
import com.bookbrowser.readrack.dto.AuthorSummaryDto; // Import the new DTO
import com.bookbrowser.readrack.dto.BookRequestDto;
import com.bookbrowser.readrack.dto.BookResponseDto;
import com.bookbrowser.readrack.model.Author;
import com.bookbrowser.readrack.model.AuthorBook;
import com.bookbrowser.readrack.model.Book;
import com.bookbrowser.readrack.repository.AuthorBookRepository;
import com.bookbrowser.readrack.repository.AuthorRepository;
import com.bookbrowser.readrack.repository.BookRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger; // Optional: for logging
import org.slf4j.LoggerFactory; // Optional: for logging
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Objects; // For null check filtering
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookService {

    // Optional: Logger
    private static final Logger log = LoggerFactory.getLogger(BookService.class);

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final AuthorBookRepository authorBookRepository;

    @Autowired
    public BookService(BookRepository bookRepository, AuthorRepository authorRepository, AuthorBookRepository authorBookRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.authorBookRepository = authorBookRepository;
    }

    @Transactional // Essential for multi-repository operations
    public BookResponseDto createBook(BookRequestDto bookRequestDto) {
        // 1. Create and save the book entity (ID gets generated)
        Book book = new Book();
        book.setName(bookRequestDto.getName());
        book.setReaders(bookRequestDto.getReaders());
        book.setDescription(bookRequestDto.getDescription());
        Book savedBook = bookRepository.save(book); // Save book first to get its generated ID
        log.info("Created book with ID: {}", savedBook.getBookId());

        // 2. Find author entities based on provided IDs
        List<Author> authors = authorRepository.findByAuthorIdIn(bookRequestDto.getAuthorIds());

        // 3. Validate if all requested authors were found
        if (authors.size() != bookRequestDto.getAuthorIds().size()) {
            List<Long> foundIds = authors.stream().map(Author::getAuthorId).collect(Collectors.toList());
            List<Long> notFoundIds = bookRequestDto.getAuthorIds().stream()
                    .filter(id -> !foundIds.contains(id))
                    .collect(Collectors.toList());
            log.error("Author IDs not found during book creation: {}", notFoundIds);
            throw new EntityNotFoundException("Could not find authors with IDs: " + notFoundIds);
        }

        // 4. Create and save AuthorBook join table entries
        for (Author author : authors) {
            AuthorBook authorBook = new AuthorBook(author, savedBook);
            authorBookRepository.save(authorBook);
            log.debug("Associated author {} with book {}", author.getAuthorId(), savedBook.getBookId());
        }

        // 5. Create AuthorSummaryDto list from the fetched authors (used for the response)
        List<AuthorSummaryDto> authorSummaries = authors.stream()
                .map(author -> new AuthorSummaryDto(author.getAuthorId(), author.getName()))
                .collect(Collectors.toList());

        // 6. Map to response DTO using the summaries and return
        return mapBookToDto(savedBook, authorSummaries);
    }

    @Transactional(readOnly = true) // Ensures the whole method runs in a transaction
    public List<BookResponseDto> getAllBooks() {
        log.info("Fetching all books");
        List<Book> books = bookRepository.findAll();
        // Use the helper that fetches authors details for each book
        return books.stream()
                .map(this::mapBookToDtoWithFetchedAuthors)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true) // Ensures the whole method runs in a transaction
    public BookResponseDto getBookById(Long bookId) {
        log.info("Fetching book with ID: {}", bookId);
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> {
                    log.error("Book not found with ID: {}", bookId);
                    return new EntityNotFoundException("Book not found with id: " + bookId);
                });
        // Use the helper that fetches authors details
        return mapBookToDtoWithFetchedAuthors(book);
    }

    @Transactional
    public BookResponseDto updateBook(Long bookId, BookRequestDto bookRequestDto) {
        log.info("Updating book with ID: {}", bookId);
        // 1. Find the existing book
        Book existingBook = bookRepository.findById(bookId)
                .orElseThrow(() -> {
                    log.error("Book not found for update with ID: {}", bookId);
                    return new EntityNotFoundException("Book not found with id: " + bookId);
                });

        // 2. Update book properties
        existingBook.setName(bookRequestDto.getName());
        existingBook.setReaders(bookRequestDto.getReaders());
        existingBook.setDescription(bookRequestDto.getDescription());
        log.debug("Updated properties for book ID: {}", bookId);

        // 3. Find the new set of authors
        List<Author> newAuthors = authorRepository.findByAuthorIdIn(bookRequestDto.getAuthorIds());
        if (newAuthors.size() != bookRequestDto.getAuthorIds().size()) {
            List<Long> foundIds = newAuthors.stream().map(Author::getAuthorId).collect(Collectors.toList());
            List<Long> notFoundIds = bookRequestDto.getAuthorIds().stream()
                    .filter(id -> !foundIds.contains(id))
                    .collect(Collectors.toList());
            log.error("Author IDs not found during book update: {}", notFoundIds);
            throw new EntityNotFoundException("Could not find authors with IDs for update: " + notFoundIds);
        }

        // 4. Efficiently update associations: Remove old, add new
        log.debug("Deleting old associations for book ID: {}", bookId);
        authorBookRepository.deleteByBook(existingBook); // Using derived delete query
        authorBookRepository.flush(); // Ensure deletes are executed before inserts in the same transaction

        // 5. Create new associations
        log.debug("Creating new associations for book ID: {}", bookId);
        for (Author author : newAuthors) {
            AuthorBook authorBook = new AuthorBook(author, existingBook);
            authorBookRepository.save(authorBook);
            log.debug("Associated author {} with updated book {}", author.getAuthorId(), existingBook.getBookId());
        }

        // 6. Save the updated book properties (may not be strictly necessary if only associations changed, but safe)
        Book updatedBook = bookRepository.save(existingBook);

        // 7. Create AuthorSummaryDto list from the new authors (used for the response)
        List<AuthorSummaryDto> authorSummaries = newAuthors.stream()
                .map(author -> new AuthorSummaryDto(author.getAuthorId(), author.getName()))
                .collect(Collectors.toList());

        // 8. Map to response DTO using the summaries and return
        return mapBookToDto(updatedBook, authorSummaries);
    }

    public List<BookResponseDto> searchBooks(String searchTerm) {
        return bookRepository.findByNameLikeIgnoreCase(searchTerm).stream()
                .map(this::mapBookToDtoWithFetchedAuthors)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteBook(Long bookId) {
        log.info("Attempting to delete book with ID: {}", bookId);
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> {
                    log.error("Book not found for deletion with ID: {}", bookId);
                    return new EntityNotFoundException("Book not found with id: " + bookId);
                });

        // Deleting the book should cascade to AuthorBook entries because of
        // CascadeType.ALL and orphanRemoval=true on Book's @OneToMany mapping.
        // If cascading wasn't correctly configured, you would need:
        // log.debug("Explicitly deleting associations for book ID: {}", bookId);
        // authorBookRepository.deleteByBook(book);
        bookRepository.delete(book);
        log.info("Successfully deleted book with ID: {}", bookId);
    }


    // --- Helper Methods for DTO Mapping ---

    /**
     * Maps a Book entity to a BookResponseDto, fetching associated author summaries.
     * This involves querying the AuthorBook join table.
     * @param book The Book entity to map.
     * @return BookResponseDto containing author summaries.
     */
    private BookResponseDto mapBookToDtoWithFetchedAuthors(Book book) {
        log.debug("Mapping book {} with fetched authors", book.getBookId());
        // Fetch associated AuthorBook entries to get author details
        // ** Performance Note:** Accessing ab.getAuthor().getName() below might trigger
        //    N+1 select problems if Author entities are lazily loaded (default).
        //    Consider using a JOIN FETCH query in the repository or a projection
        //    for better performance with many authors per book.
        List<AuthorBook> authorBooks = authorBookRepository.findByBook(book);

        List<AuthorSummaryDto> authorSummaries = authorBooks.stream()
                .map(ab -> {
                    Author author = ab.getAuthor(); // Get the associated Author from the join entity
                    if (author == null) {
                        // This case should ideally not happen with proper DB constraints, but good to handle
                        log.warn("AuthorBook with id {} links to a null author for book {}", ab.getId(), book.getBookId());
                        return null;
                    }
                    // Create the summary DTO using Author's ID and Name
                    return new AuthorSummaryDto(author.getAuthorId(), author.getName());
                })
                .filter(Objects::nonNull) // Filter out any nulls that might have occurred
                .collect(Collectors.toList());
        log.debug("Found {} author summaries for book {}", authorSummaries.size(), book.getBookId());

        // Call the base mapper with the created author summaries
        return mapBookToDto(book, authorSummaries);
    }

    /**
     * Base mapping method to convert a Book entity and a pre-compiled list
     * of author summaries into a BookResponseDto.
     * @param book The Book entity.
     * @param authorSummaries The list of AuthorSummaryDto for the book's authors.
     * @return BookResponseDto.
     */
    private BookResponseDto mapBookToDto(Book book, List<AuthorSummaryDto> authorSummaries) {
        BookResponseDto dto = new BookResponseDto();
        dto.setBookId(book.getBookId());
        dto.setName(book.getName());
        dto.setReaders(book.getReaders());
        dto.setDescription(book.getDescription());
        dto.setAuthors(authorSummaries); // Set the list of author summaries
        return dto;
    }
}
