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

func (s *BookService) GetBookDetails(bookID int) (*models.Book, error) {
	return s.BookRepo.GetBookDetails(bookID)
}

func (s *BookService) AddBook(book models.Book) (int, error) {
	return s.BookRepo.AddBook(book)
}

//	func (s *BookService) UpdateBook(book models.Book) error {
//		return s.BookRepo.UpdateBook(book)
//	}
func (s *BookService) UpdateBook(id int, updates map[string]interface{}) error {
	return s.BookRepo.UpdateBook(id, updates)
}

func (s *BookService) DeleteBook(bookID int) error {
	return s.BookRepo.DeleteBook(bookID)
}
