package main

import (
	"backend/config"
	"backend/handler"
	"backend/repositories"
	service "backend/services"
	"time"

	"github.com/gin-contrib/cors"
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
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.POST("/register", authHandler.Register)
	r.POST("/login", authHandler.Login)

	r.GET("/books", bookHandler.GetAllBooks)
	r.POST("/books", bookHandler.AddBook)
	r.PUT("/books/:id", bookHandler.UpdateBook)
	r.DELETE("/books/:id", bookHandler.DeleteBook)
	r.GET("/books/:id/details", bookHandler.GetBookDetails)

	borrowingRepo := repositories.NewBorrowingRepository(config.DB)
	borrowingService := service.NewBorrowingService(borrowingRepo)
	borrowingHandler := handler.NewBorrowingHandler(borrowingService)

	api := r.Group("/book")
	{
		api.POST("/borrow/:user_id/:book_id", borrowingHandler.BorrowBook)
		api.PUT("/return/:user_id/:book_id", borrowingHandler.ReturnBook)
		api.GET("/history/:user_id", borrowingHandler.GetBorrowingHistory)
	}

	r.Run(":8080")
}
