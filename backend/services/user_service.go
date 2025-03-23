package service

import (
	"backend/models"
	"backend/repositories"
)

type UserService struct {
	UserRepo *repositories.UserRepository
}

func NewUserService(userRepo *repositories.UserRepository) *UserService {
	return &UserService{UserRepo: userRepo}
}

func (s *UserService) GetAllUsers() ([]models.User, error) {
	return s.UserRepo.GetAllUserss()
}

func (s *UserService) GetUserDetails(username string) (*models.User, error) {
	return s.UserRepo.GetUserDetails(username)
}
