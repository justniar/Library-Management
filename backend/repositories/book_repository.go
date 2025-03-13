package repositories

import (
	"backend/models"
	"database/sql"
	"errors"
	"log"
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

// func (r *BookRepository) ReturnBook() ([]models.Book, error) {

// }
