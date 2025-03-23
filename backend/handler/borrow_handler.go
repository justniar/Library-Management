package handler

import (
	"math"
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

	limit := 8
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))

	if err != nil || page < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page number"})
		return
	}
	offset := (page - 1) * limit

	history, totalCount, err := h.BorrowingService.GetAllBorrowingHistory(limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch borrowing history"})
		return
	}

	totalPages := int(math.Ceil(float64(totalCount) / float64(limit)))
	c.JSON(http.StatusOK, gin.H{
		"history":       history,
		"total_history": totalCount,
		"total_pages":   totalPages,
		"current_page":  page,
	})
}

func (h *BorrowingHandler) GetBorrowingHistory(c *gin.Context) {
	limit := 8
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))

	if err != nil || page < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page number"})
		return
	}
	offset := (page - 1) * limit
	userID, _ := strconv.Atoi(c.Param("user_id"))

	history, totalCount, err := h.BorrowingService.GetBorrowingHistory(userID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch borrowing history"})
		return
	}

	totalPages := 0
	if totalCount > 0 {
		totalPages = int(math.Ceil(float64(totalCount) / float64(limit)))
	}
	c.JSON(http.StatusOK, gin.H{
		"history":       history,
		"total_history": totalCount,
		"total_pages":   totalPages,
		"current_page":  page,
	})
}
