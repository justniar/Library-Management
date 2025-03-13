package handler

import (
	"backend/models"
	"backend/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type BookHandler struct {
	BookService *service.BookService
}

func NewBookHandler(bookService *service.BookService) *BookHandler {
	return &BookHandler{BookService: bookService}
}

func (h *BookHandler) GetAllBooks(c *gin.Context) {
	books, err := h.BookService.GetAllBooks()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get books"})
		return
	}
	c.JSON(http.StatusOK, books)
}

func (h *BookHandler) GetBookDetails(c *gin.Context) {
	bookID := c.Param("id")
	id, err := strconv.Atoi(bookID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
		return
	}

	bookDetails, err := h.BookService.GetBookDetails(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book details not found"})
		return
	}

	c.JSON(http.StatusOK, bookDetails)
}

func (h *BookHandler) AddBook(c *gin.Context) {
	var book models.Book
	if err := c.ShouldBindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	bookID, err := h.BookService.AddBook(book)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add book"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Book added successfully", "book_id": bookID})
}

func (h *BookHandler) UpdateBook(c *gin.Context) {
	var book models.Book

	bookID := c.Param("id")

	id, err := strconv.Atoi(bookID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
		return
	}
	book.ID = id

	if err := c.ShouldBindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.BookService.UpdateBook(book); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update book"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Book updated successfully"})
}

func (h *BookHandler) DeleteBook(c *gin.Context) {
	bookID := c.Param("id")
	id, err := strconv.Atoi(bookID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
		return
	}

	if err := h.BookService.DeleteBook(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Book deleted successfully"})
}
