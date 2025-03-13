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

func (s *BookService) UpdateBook(book models.Book) error {
	return s.BookRepo.UpdateBook(book)
}

func (s *BookService) DeleteBook(bookID int) error {
	return s.BookRepo.DeleteBook(bookID)
}
