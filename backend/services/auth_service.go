package services

import "backend/repositories"

type AuthService struct {
	r *repositories.Repository
}

func NewAuthService(r *repositories.Repository) *AuthService {
	return &AuthService{Repo: repo}
}
