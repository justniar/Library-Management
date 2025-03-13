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

	bookRepo := repositories.NewBookRepository(config.DB)
	bookService := service.NewBookService(bookRepo)
	bookHandler := handler.NewBookHandler(bookService)

	r := gin.Default()

	r.POST("/register", authHandler.Register)
	r.POST("/login", authHandler.Login)

	r.GET("/books", bookHandler.GetAllBooks)
	r.POST("/books", bookHandler.AddBook)

	r.Run(":8080")
}
