package repositories

import (
	"backend/models"
	"database/sql"
)

type Repository struct {
	DB *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{DB: db}
}

func (r *Repository) RegisterUser(user models.User) error {
	_, err := r.DB.Exec("INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)", user.Username, user.Email, user.PasswordHash)
	return err
}

func (r *Repository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.DB.QueryRow("SELECT id, username, email, password_hash FROM users WHERE email=$1", email).Scan(&user.ID, &user.Username, &user.Email, &user.PasswordHash)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (repo *Repository) GetAllBooks() ([]models.Book, error) {
	rows, err := repo.DB.Query("SELECT id, title, author, stock FROM books")
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
