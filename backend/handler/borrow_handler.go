package handler

import (
	"net/http"
	"strconv"

	service "backend/services"

	"github.com/gin-gonic/gin"
)

type BorrowingHandler struct {
	BorrowingService service.BorrowingService
}

func NewBorrowingHandler(borrowingService service.BorrowingService) *BorrowingHandler {
	return &BorrowingHandler{BorrowingService: borrowingService}
}

func (h *BorrowingHandler) BorrowBook(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("user_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}
	bookID, err := strconv.Atoi(c.Param("book_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
		return
	}

	err = h.BorrowingService.BorrowBook(userID, bookID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Book borrowed successfully"})
}

func (h *BorrowingHandler) ReturnBook(c *gin.Context) {
	userID, _ := strconv.Atoi(c.Param("user_id"))
	bookID, _ := strconv.Atoi(c.Param("book_id"))

	err := h.BorrowingService.ReturnBook(userID, bookID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to return book"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Book returned successfully"})
}

func (h *BorrowingHandler) GetBorrowingHistory(c *gin.Context) {
	userID, _ := strconv.Atoi(c.Param("user_id"))

	history, err := h.BorrowingService.GetBorrowingHistory(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch borrowing history"})
		return
	}
	c.JSON(http.StatusOK, history)
}
