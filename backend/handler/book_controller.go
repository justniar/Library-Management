package handler

import (
	"backend/config"
	"backend/repositories"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

var bookRepo = repositories.NewBookRepository(config.DB)

func GetAllBooks(c *gin.Context) {
	books, err := bookRepo.GetAllBooks()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch books"})
		return
	}
	c.JSON(http.StatusOK, books)
}

func BorrowBook(c *gin.Context) {
	userID := c.MustGet("user_id").(int)
	bookID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
		return
	}

	err = bookRepo.BorrowBook(userID, bookID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to borrow book"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Book borrowed successfully"})
}

// func ReturnBook(c *gin.Context) {
// 	userID := c.MustGet("user_id").(int)
// 	bookID, err := strconv.Atoi(c.Param("id"))
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
// 		return
// 	}

// 	err = bookRepo.ReturnBook(userID, bookID)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to return book"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"message": "Book returned successfully"})
// }
