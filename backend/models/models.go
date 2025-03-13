package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID           int       `json:"id"`
	Username     string    `json:"username"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Role         string    `json:role"`
	CreatedAt    time.Time `json:"created_at,now()"`
	UpdatedAt    time.Time `json:"updates_at,omitempty"`
	DeletedAt    time.Time `json:"deleted_at,omitempty"`
}

type Book struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Author    string    `json:"author"`
	Stock     int       `json:"stock"`
	ImageUrl  string    `json:"image_url"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updates_at"`
	DeletedAt time.Time `json:"deleted_at"`
}

type BorrowHistory struct {
	ID         int        `json:"id"`
	UserID     int        `json:"user_id"`
	BookID     int        `json:"book_id"`
	BorrowDate time.Time  `json:"borrow_date"`
	ReturnDate *time.Time `json:"return_date"`
	Status     string     `json:"status"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updates_at"`
	DeletedAt  time.Time  `json:"deleted_at"`
}
