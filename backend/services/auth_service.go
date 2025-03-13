package services

import (
	"backend/models"
	"backend/repositories"
	"backend/utils"
	"errors"
	"fmt"
)

type AuthService struct {
	Repo *repositories.UserRepository
}

func NewAuthService(r *repositories.UserRepository) *AuthService {
	return &AuthService{Repo: r}
}

func (s *AuthService) Register(user models.User) error {
	fmt.Println("Received User:", user)
	hashedPassword, err := utils.HashPassword(user.PasswordHash)
	if err != nil {
		fmt.Println("Hashing Error:", err)
		return err
	}
	user.PasswordHash = hashedPassword
	user.Role = "user"
	err = s.Repo.RegisterUser(user)
	if err != nil {
		fmt.Println("Database Error:", err)
	}
	return err
}

func (s *AuthService) Login(email, password string) (string, error) {
	user, err := s.Repo.GetUserByEmail(email)
	if err != nil {
		return "", errors.New("user not found")
	}

	if !utils.CheckPassword(password, user.PasswordHash) {
		return "", errors.New("invalid credentials")
	}

	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		return "", err
	}

	return token, nil
}
