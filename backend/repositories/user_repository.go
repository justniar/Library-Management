package repositories

import (
	"backend/models"
	"database/sql"
	"fmt"
)

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) RegisterUser(user models.User) error {
	_, err := r.DB.Exec("INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)",
		user.Username, user.Email, user.PasswordHash, user.Role)

	if err != nil {
		fmt.Println("Database Insert Error:", err)
	}
	return err
}

func (r *UserRepository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.DB.QueryRow("SELECT id, username, email, password_hash, role FROM users WHERE email=$1", email).
		Scan(&user.ID, &user.Username, &user.Email, &user.PasswordHash, &user.Role)
	if err != nil {
		return nil, err
	}
	return &user, nil
}
