package repositories

import (
	"backend/models"
	"database/sql"
	"errors"
	"log"
	"time"
)

type BookRepository struct {
	DB *sql.DB
}

func NewBookRepository(db *sql.DB) *BookRepository {
	return &BookRepository{DB: db}
}

func (r *BookRepository) GetAllBooks() ([]models.Book, error) {
	query := `SELECT id, title, author, category, stock, image_url, created_at, updated_at FROM books WHERE deleted_at IS NULL`
	rows, err := r.DB.Query(query)
	if err != nil {
		log.Println("Error fetching books:", err)
		return nil, err
	}
	defer rows.Close()

	var books []models.Book
	for rows.Next() {
		var book models.Book
		err := rows.Scan(&book.ID, &book.Title, &book.Author, &book.Category, &book.Stock, &book.ImageUrl, &book.CreatedAt, &book.UpdatedAt)
		if err != nil {
			log.Println("Error scanning book:", err)
			return nil, err
		}
		books = append(books, book)
	}
	return books, nil
}

func (r *BookRepository) GetBookDetails(bookID int) (*models.BookDetails, error) {
	query := `SELECT id, book_id, publisher, publication_year, pages, language, description, isbn, created_at, updated_at, deleted_at 
			  FROM book_details WHERE book_id = $1 AND deleted_at IS NULL`

	var bookDetails models.BookDetails
	err := r.DB.QueryRow(query, bookID).Scan(
		&bookDetails.ID, &bookDetails.BookID, &bookDetails.Publisher,
		&bookDetails.PublicationYear, &bookDetails.Pages, &bookDetails.Language,
		&bookDetails.Description, &bookDetails.ISBN, &bookDetails.CreatedAt,
		&bookDetails.UpdatedAt, &bookDetails.DeletedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("book details not found")
		}
		return nil, err
	}

	return &bookDetails, nil
}

func (r *BookRepository) AddBook(book models.Book) (int, error) {
	var bookID int
	query := `INSERT INTO books (title, author, category, stock, image_url, created_at, updated_at)
	          VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id`

	err := r.DB.QueryRow(query, book.Title, book.Author, book.Category, book.Stock, book.ImageUrl).Scan(&bookID)
	if err != nil {
		log.Println("Error adding book:", err)
		return 0, err
	}

	return bookID, nil
}

func (r *BookRepository) UpdateBook(book models.Book) error {
	query := `UPDATE books 
              SET title = $1, author = $2, category = $3, stock = $4, image_url = $5, updated_at = NOW() 
              WHERE id = $6 AND deleted_at IS NULL`

	_, err := r.DB.Exec(query, book.Title, book.Author, book.Category, book.Stock, book.ImageUrl, book.ID)
	if err != nil {
		log.Println("Error updating book:", err)
		return err
	}

	return nil
}

func (r *BookRepository) BorrowBook(userID, bookID int) error {
	var stock int
	err := r.DB.QueryRow("SELECT stock FROM books WHERE id=?", bookID).Scan(&stock)
	if err != nil {
		if err == sql.ErrNoRows {
			return errors.New("book not found")
		}
		return err
	}
	if stock <= 0 {
		return errors.New("book is out of stock")
	}

	_, err = r.DB.Exec("UPDATE books SET stock = stock - 1 WHERE id=?", bookID)
	if err != nil {
		return err
	}

	_, err = r.DB.Exec("INSERT INTO borrow_history(user_id, book_id, borrow_date, status) VALUES (?, ?, NOW(), 'borrowed')", userID, bookID)
	if err != nil {
		return err
	}

	return nil
}

func (r *BookRepository) DeleteBook(bookID int) error {
	var exists bool
	err := r.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM books WHERE id=$1 AND deleted_at IS NULL)", bookID).Scan(&exists)
	if err != nil {
		log.Println("Error checking book existence:", err)
		return err
	}
	if !exists {
		return errors.New("book not found or already deleted")
	}

	_, err = r.DB.Exec("UPDATE books SET deleted_at = $2 WHERE id = $1", bookID, time.Now())
	if err != nil {
		log.Println("Error soft deleting book:", err)
		return err
	}

	return nil
}
