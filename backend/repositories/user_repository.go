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
		u.id, u.username, u.email, u.role, 
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
		err := rows.Scan(&user.ID, &user.Username, &user.Email, &user.Role, &user.FullName, &user.Aboutme, &user.Genre, &user.Phone, &user.Address, &user.CreatedAt, &user.UpdatedAt)
		if err != nil {
			log.Println("Error scanning user:", err)
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

// func (r *UserRepository) GetUserDetails(userID int) (*models.Book, error) {
// 	query := `
// 		SELECT id, user_id, full_name, about_me, genre, phone, address, created_at, updated_at
// 		FROM user_details WHERE deleted_at IS NULL`

// 	log.Println("Executing query:", query, "with bookID:", userID)
// 	var user models.User
// 	err := r.DB.QueryRow(query, userID).Scan(
// 		&book.ID, &book.Title, &book.Author, &book.Category, &book.Stock, &book.Image,
// 		&book.Publisher, &book.PublicationYear, &book.Pages, &book.Language,
// 		&book.Description, &book.ISBN, &book.CreatedAt, &book.UpdatedAt, &book.DeletedAt,
// 	)

// 	if err != nil {
// 		if err == sql.ErrNoRows {
// 			log.Println("No book found with ID:", userID)
// 			return nil, errors.New("book details not found")
// 		}
// 		log.Println("Database error:", err)
// 		return nil, err
// 	}

// 	return &user, nil
// }
