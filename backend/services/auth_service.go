package service

import (
	"backend/models"
	"backend/repositories"
	"backend/utils/hash"
	"backend/utils/jwt"
	"errors"
	"strconv"
)

type AuthService struct {
	UserRepo *repositories.UserRepository
}

func NewAuthService(userRepo *repositories.UserRepository) *AuthService {
	return &AuthService{UserRepo: userRepo}
}

func (s *AuthService) Register(username, email, password, role string) (*models.User, error) {
	hashedPassword, err := hash.HashPassword(password)

	if err != nil {
		return nil, err
	}

	user := &models.User{
		Username:     username,
		Email:        email,
		PasswordHash: hashedPassword,
		Role:         role,
	}

	err = s.UserRepo.CreateUser(user)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *AuthService) Login(email, password string) (string, error) {
	user, err := s.UserRepo.GetUserByEmail(email)
	if err != nil || user == nil {
		return "", errors.New("invalid credentials")
	}

	if !hash.CheckPasswordHash(password, user.PasswordHash) {
		return "", errors.New("invalid credentials")
	}

	token, err := jwt.GenerateToken(strconv.Itoa(user.ID), user.Email, user.Role, user.Username)
	if err != nil {
		return "", err
	}

	return token, nil
}
