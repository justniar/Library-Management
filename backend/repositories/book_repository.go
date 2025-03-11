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
	for i, book := range books {
		if book.ID == bookID {
			if book.Stock > 0 {
				books[i].Stock--
				return nil
			}
			return errors.New("book is out of stock")
		}
	}
	return errors.New("book not found")
}

func (r *BookRepository) ReturnBook() ([]models.Book, error) {

}
