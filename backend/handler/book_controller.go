package handler

import (
	"backend/models"
	service "backend/services"
	"fmt"
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

	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to upload image"})
		return
	}
	filePath := fmt.Sprintf("../uploads/%s", file.Filename)
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
		return
	}

	title := c.PostForm("title")
	author := c.PostForm("author")
	category := c.PostForm("category")
	stockStr := c.PostForm("stock")

	stock, err := strconv.Atoi(stockStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid stock value"})
		return
	}

	book = models.Book{
		Title:    title,
		Author:   author,
		Category: category,
		Stock:    stock,
		ImageUrl: filePath,
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
