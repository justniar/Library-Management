package service

import (
	"backend/models"
	"backend/repositories"
)

type BorrowingService interface {
	BorrowBook(userID, bookID int) error
	ReturnBook(userID, bookID int) error
	GetBorrowingHistory(userID int) ([]models.BorrowHistory, error)
	GetAllBorrowingHistory() ([]models.BorrowHistory, error)
}

type borrowingService struct {
	BorrowingRepo repositories.BorrowingRepository
}

func NewBorrowingService(borrowingRepo repositories.BorrowingRepository) BorrowingService {
	return &borrowingService{BorrowingRepo: borrowingRepo}
}

func (s *borrowingService) BorrowBook(userID, bookID int) error {
	return s.BorrowingRepo.BorrowBook(userID, bookID)
}

func (s *borrowingService) ReturnBook(userID, bookID int) error {
	return s.BorrowingRepo.ReturnBook(userID, bookID)
}

func (s *borrowingService) GetAllBorrowingHistory() ([]models.BorrowHistory, error) {
	return s.BorrowingRepo.GetAllBorrowingHistory()
}

func (s *borrowingService) GetBorrowingHistory(userID int) ([]models.BorrowHistory, error) {
	return s.BorrowingRepo.GetBorrowingHistory(userID)
}
