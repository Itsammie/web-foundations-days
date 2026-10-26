# Library REST API Design

A RESTful API design for managing a library's books resource.

## Endpoints

### 1. List All Books
- **Method:** `GET`
- **Path:** `/api/books`
- **Description:** Retrieves a list of all books available in the library inventory.
- **Success Status Code:** `200 OK`

### 2. Get One Book
- **Method:** `GET`
- **Path:** `/api/books/{id}`
- **Description:** Retrieves details of a single book by its unique ID.
- **Success Status Code:** `200 OK`

### 3. List Books by Author
- **Method:** `GET`
- **Path:** `/api/books?author={authorName}`
- **Description:** Retrieves a filtered list of books written by a specific author using a query parameter.
- **Success Status Code:** `200 OK`

### 4. Create a Book
- **Method:** `POST`
- **Path:** `/api/books`
- **Description:** Adds a new book to the library collection.
- **Example Request Body:**
  ```json
  {
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "publishedYear": 2008
  }