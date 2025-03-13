package repositories

import (
	"backend/models"
	"database/sql"
	"errors"
)

type BookRepository struct {
	DB *sql.DB
}

func NewBookRepository(db *sql.DB) *BookRepository {
	return &BookRepository{DB: db}
}

func (r *BookRepository) GetAllBooks() ([]models.Book, error) {
	rows, err := r.DB.Query("SELECT id, title, author, stock FROM books")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var books []models.Book
	for rows.Next() {
		var book models.Book
		err := rows.Scan(&book.ID, &book.Title, &book.Author, &book.Stock)
		if err != nil {
			return nil, err
		}
		books = append(books, book)
	}
	return books, nil
}

// func (r *BookRepository) AddBook() ([]models.Book, error) {

// }

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
