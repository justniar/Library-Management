package handler

import (
	"backend/models"
	service "backend/services"
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"
	"time"

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

	book, err := h.BookService.GetBookDetails(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book details not found"})
		return
	}

	c.JSON(http.StatusOK, book)
}

func (h *BookHandler) AddBook(c *gin.Context) {
	var book models.Book

	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to upload image"})
		return
	}

	uniqueFilename := fmt.Sprintf("%d-%s", time.Now().UnixNano(), file.Filename)
	filePath := filepath.Join("uploads", uniqueFilename)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
		return
	}

	book.Title = c.PostForm("title")
	book.Author = c.PostForm("author")
	book.Category = c.PostForm("category")
	book.Publisher = c.PostForm("publisher")

	publicationYear, err := strconv.Atoi(c.PostForm("publication_year"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid publication year"})
		return
	}
	book.PublicationYear = publicationYear

	pages, err := strconv.Atoi(c.PostForm("pages"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page count"})
		return
	}
	book.Pages = pages

	book.Language = c.PostForm("language")
	book.Description = c.PostForm("description")
	book.ISBN = c.PostForm("isbn")

	stock, err := strconv.Atoi(c.PostForm("stock"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid stock value"})
		return
	}
	book.Stock = stock
	book.Image = filePath

	bookID, err := h.BookService.AddBook(book)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add book"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Book added successfully",
		"book_id": bookID,
	})
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
