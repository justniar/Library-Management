package controllers

import (
	"backend/config"
	"backend/models"
	"backend/repositories"
	"backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

var repo = repositories.NewRepository(config.DB)
var authService = services.NewAuthService(repo)

func Register(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	err := authService.Register(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Registration Failed"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

func Login(c *gin.Context) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	token, err := authService.Login(input.Email, input.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

func Logout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "user logged out"})
}
