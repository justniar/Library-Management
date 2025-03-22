package models

import (
	"time"
)

type User struct {
	ID           int       `json:"id"`
	Username     string    `json:"username"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Role         string    `json:"role"`
	FullName     string    `json:"full_name"`
	Aboutme      string    `json:"about_me"`
	Genre        string    `json:"genre"`
	Phone        string    `json:"phone"`
	Address      string    `json:"address"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	DeletedAt    time.Time `json:"deleted_at,omitempty"`
}

type Book struct {
	ID              int        `json:"id"`
	Title           string     `json:"title"`
	Author          string     `json:"author"`
	Category        string     `json:"category"`
	Stock           int        `json:"stock"`
	Image           string     `json:"image"`
	Publisher       string     `json:"publisher"`
	PublicationYear int        `json:"publication_year"`
	Pages           int        `json:"pages"`
	Language        string     `json:"language"`
	Description     string     `json:"description"`
	ISBN            string     `json:"isbn"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
	DeletedAt       *time.Time `json:"deleted_at,omitempty"`
}

type BorrowHistory struct {
	ID         int        `json:"id"`
	UserID     int        `json:"user_id"`
	BookID     int        `json:"book_id"`
	Title      string     `json:"title" binding:"required"`
	Image      string     `json:"image"`
	Author     string     `json:"author" binding:"required"`
	Category   string     `json:"category"`
	BorrowDate time.Time  `json:"borrow_date"`
	ReturnDate *time.Time `json:"return_date,omitempty"`
	Status     string     `json:"status"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
	DeletedAt  *time.Time `json:"deleted_at,omitempty"`
}
