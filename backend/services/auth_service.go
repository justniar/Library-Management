package services

import (
	"backend/repositories"
	"backend/utils"
	"errors"
)

type AuthService struct {
	Repo *repositories.Repository
}

func NewAuthService(r *repositories.Repository) *AuthService {
	return &AuthService{Repo: r}
}

func (s *AuthService) Register(user models.user) error {
	hashedPassword, err := utils.HashPassword(user.PasswordHash)
	if err != nil {
		return err
	}
	user.PasswordHash = hashedPassword
	return s.Repo.RegisterUser(user)
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
