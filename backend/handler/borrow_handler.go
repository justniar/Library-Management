package handler

import (
	"net/http"
	"strconv"
	"strings"

	service "backend/services"
	"backend/utils/jwt"

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

func (h *BorrowingHandler) GetAllBorrowingHistory(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
		return
	}

	tokenParts := strings.Split(authHeader, " ")
	if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
		return
	}
	tokenString := tokenParts[1]

	claims, err := jwt.ValidateToken(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	role, ok := claims["role"].(string)
	if !ok || role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	history, err := h.BorrowingService.GetAllBorrowingHistory()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch borrowing history"})
		return
	}

	c.JSON(http.StatusOK, history)
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
