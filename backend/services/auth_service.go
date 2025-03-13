package service

import (
	"backend/models"
	"backend/repositories"
	"backend/utils/hash"
	"backend/utils/jwt"
	"errors"
	"fmt"
)

type AuthService struct {
	UserRepo *repositories.UserRepository
}

func NewAuthService(userRepo *repositories.UserRepository) *AuthService {
	return &AuthService{UserRepo: userRepo}
}

func (s *AuthService) Register(username, email, password, role string) (*models.User, error) {
	fmt.Println("Plain Password:", password)
	hashedPassword, err := hash.HashPassword(password)

	if err != nil {
		return nil, err
	}
	fmt.Println("Hashed Password:", hashedPassword)

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
		fmt.Println("Password verification failed")
		return "", errors.New("invalid credentials")
	}

	token, err := jwt.GenerateToken(user.Email, user.Role)
	if err != nil {
		return "", err
	}
	fmt.Println("Login Email:", email)
	fmt.Println("Login Password:", password)
	fmt.Println("Stored Hash:", user.PasswordHash)

	return token, nil
}
