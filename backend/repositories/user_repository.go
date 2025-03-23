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

func (r *UserRepository) GetAllUserss(limit, offset int) ([]models.User, int, error) {
	var users []models.User
	var totalCount int

	countQuery := "SELECT COUNT(*) FROM users WHERE deleted_at IS NULL"
	err := r.DB.QueryRow(countQuery).Scan(&totalCount)
	if err != nil {
		log.Println("Error fetching total book count:", err)
		return nil, 0, err
	}

	query := `
		SELECT 
			u.id, COALESCE(ud.user_id, 0), u.username, u.email, u.role, 
			COALESCE(ud.full_name, ''), COALESCE(ud.about_me, ''), 
			COALESCE(ud.genre, ''), COALESCE(ud.phone, ''), 
			COALESCE(ud.address, ''), u.created_at, u.updated_at
		FROM users u
		LEFT JOIN user_details ud ON u.id = ud.user_id
		ORDER BY created_at DESC LIMIT $1 OFFSET $2;
		`
	rows, err := r.DB.Query(query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	for rows.Next() {
		var user models.User
		err := rows.Scan(&user.ID, &user.UserID, &user.Username, &user.Email, &user.Role, &user.FullName, &user.Aboutme, &user.Genre, &user.Phone, &user.Address, &user.CreatedAt, &user.UpdatedAt)
		if err != nil {
			log.Println("Error scanning user:", err)
			return nil, 0, err
		}
		users = append(users, user)
	}

	return users, totalCount, nil
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
