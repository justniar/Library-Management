package service

import (
	"backend/models"
	"backend/repositories"
)

type BookService struct {
	BookRepo *repositories.BookRepository
}

func NewBookService(bookRepo *repositories.BookRepository) *BookService {
	return &BookService{BookRepo: bookRepo}
}

func (s *BookService) GetAllBooks() ([]models.Book, error) {
	return s.BookRepo.GetAllBooks()
}

func (s *BookService) AddBook(book models.Book) (int, error) {
	return s.BookRepo.AddBook(book)
}
