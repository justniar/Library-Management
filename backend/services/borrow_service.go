package service

import (
	"backend/models"
	"backend/repositories"
)

type BorrowingService interface {
	BorrowBook(userID, bookID int) error
	ReturnBook(userID, bookID int) error
	GetBorrowingHistory(userID, limit, offset int) ([]models.BorrowHistory, int, error)
	GetAllBorrowingHistory(limit, offset int) ([]models.BorrowHistory, int, error)
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

func (s *borrowingService) GetAllBorrowingHistory(limit, offset int) ([]models.BorrowHistory, int, error) {
	return s.BorrowingRepo.GetAllBorrowingHistory(limit, offset)
}

func (s *borrowingService) GetBorrowingHistory(userID, limit, offset int) ([]models.BorrowHistory, int, error) {
	return s.BorrowingRepo.GetBorrowingHistory(userID, limit, offset)
}
