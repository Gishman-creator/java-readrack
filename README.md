# Readrack

Readrack is a website where users can search for their favorite books, view author information, and find links to purchase or download books. The platform also features an admin panel for managing books and authors.

## Features

- **Book Search:** Search for books by title, author, or keywords.
- **Author Information:** View detailed information about authors.
- **Download/Purchase Links:** Find links to download books or purchase them on Amazon.
- **Admin Panel:** Manage books and authors (add, edit, delete).

## Technologies Used

- **Frontend:** Next.js
- **Backend:** Spring Boot
- **Database:** PostgreSQL (configured in springboot-backend/src/main/resources/application.properties)

## Setup Instructions

### Frontend (Next.js)

1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install` or `yarn install` or `pnpm install`

### Backend (Spring Boot)

1.  Navigate to the `springboot-backend` directory: `cd springboot-backend`
2.  Install dependencies: `mvn install`

## Running the Application

### Frontend (Next.js)

1.  Navigate to the `frontend` directory: `cd frontend`
2.  Start the development server: `npm run dev` or `yarn dev` or `pnpm dev`
3.  Open your browser and navigate to `http://localhost:3000`

### Backend (Spring Boot)

1.  Navigate to the `springboot-backend` directory: `cd springboot-backend`
2.  Run the application: `mvn spring-boot:run`

## Admin Panel

The admin panel allows you to:

*   Add, update, and delete authors.
*   Add, update, and delete books.
*   View the total number of books and authors.

The admin panel is located at `/admin` page.

## Contributing

You can fork the repository to contribute to the project.
