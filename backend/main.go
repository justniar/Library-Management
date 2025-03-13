package main

import (
	"backend/config"
	"backend/handler"
	"backend/repositories"
	service "backend/services"

	"github.com/gin-gonic/gin"
)

func main() {
	config.InitDB()

	userRepo := repositories.NewUserRepository(config.DB)
	authService := service.NewAuthService(userRepo)
	authHandler := handler.NewAuthHandler(authService)

	r := gin.Default()

	r.POST("/register", authHandler.Register)
	r.POST("/login", authHandler.Login)

	r.Run(":8080")
}
