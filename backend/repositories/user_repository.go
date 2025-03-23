package repositories

import (
	"backend/models"
	"database/sql"
	"errors"
	"log"
)

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) CreateUser(user *models.User) error {
	query := "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, created_at, updated_at"
	err := r.DB.QueryRow(query, user.Username, user.Email, user.PasswordHash, user.Role).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)
	return err
}

func (r *UserRepository) GetUserByEmail(email string) (*models.User, error) {
	query := "SELECT id, username, email, password_hash, role, created_at, updated_at FROM users WHERE email=$1"
	row := r.DB.QueryRow(query, email)

	var user models.User
	err := row.Scan(&user.ID, &user.Username, &user.Email, &user.PasswordHash, &user.Role, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) GetAllUserss() ([]models.User, error) {
	query := `
		SELECT 
		u.id, ud.user_id, u.username, u.email, u.role, 
		ud.full_name, ud.about_me, ud.genre, 
		ud.phone, ud.address, u.created_at, u.updated_at
		FROM users u
		LEFT JOIN user_details ud ON u.id = ud.user_id;
		`
	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		err := rows.Scan(&user.ID, &user.UserID, &user.Username, &user.Email, &user.Role, &user.FullName, &user.Aboutme, &user.Genre, &user.Phone, &user.Address, &user.CreatedAt, &user.UpdatedAt)
		if err != nil {
			log.Println("Error scanning user:", err)
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

func (r *UserRepository) GetUserDetails(username string) (*models.User, error) {
	query := `
		SELECT u.id, u.username, u.email, u.role, 
		ud.full_name, ud.about_me, ud.genre, 
		ud.phone, ud.address
		FROM users u
		LEFT JOIN user_details ud ON u.id = ud.user_id
		WHERE u.username = $1;
	`

	var user models.User
	err := r.DB.QueryRow(query, username).Scan(
		&user.ID, &user.Username, &user.Email, &user.Role,
		&user.FullName, &user.Aboutme, &user.Genre,
		&user.Phone, &user.Address,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	return &user, nil
}
