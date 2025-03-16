package handler

import (
	"backend/models"
	service "backend/services"
	"fmt"
	"log"
	"net/http"
	"os"
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
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit := 8

	offset := (page - 1) * limit

	books, err := h.BookService.GetAllBooks(limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get books"})
		return
	}
	c.JSON(http.StatusOK, books)
}

func (h *BookHandler) GetBookDetails(c *gin.Context) {
	bookID := c.Param("id")
	log.Println("Received book ID:", bookID)

	id, err := strconv.Atoi(bookID)
	if err != nil {
		log.Println("Invalid book ID:", bookID)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
		return
	}

	book, err := h.BookService.GetBookDetails(id)
	log.Println("Book not found with ID:", id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book details not found"})
		return
	}
	log.Println("Returning book details:", book)
	c.JSON(http.StatusOK, book)
}

func (h *BookHandler) AddBook(c *gin.Context) {
	var book models.Book

	file, err := c.FormFile("image")
	if err != nil {
		log.Println("Error retrieving file:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to upload image"})
		return
	}

	log.Println("Received file:", file.Filename)

	if _, err := os.Stat("uploads"); os.IsNotExist(err) {
		err := os.Mkdir("uploads", os.ModePerm)
		if err != nil {
			log.Println("Failed to create directory:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload directory"})
			return
		}
	}

	uniqueFilename := fmt.Sprintf("%d-%s", time.Now().UnixNano(), file.Filename)
	filePath := filepath.Join("uploads", uniqueFilename)

	log.Println("Saving file to:", filePath)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		log.Println("Failed to save file:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
		return
	}

	log.Println("File saved successfully!")

	book.Title = c.PostForm("title")
	book.Author = c.PostForm("author")
	book.Category = c.PostForm("category")
	book.Publisher = c.PostForm("publisher")

	publicationYear, err := strconv.Atoi(c.PostForm("publication_year"))
	if err != nil {
		log.Println("Invalid publication year:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid publication year"})
		return
	}
	book.PublicationYear = publicationYear

	pages, err := strconv.Atoi(c.PostForm("pages"))
	if err != nil {
		log.Println("Invalid page count:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page count"})
		return
	}
	book.Pages = pages

	book.Language = c.PostForm("language")
	book.Description = c.PostForm("description")
	book.ISBN = c.PostForm("isbn")

	stock, err := strconv.Atoi(c.PostForm("stock"))
	if err != nil {
		log.Println("Invalid stock value:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid stock value"})
		return
	}
	book.Stock = stock
	book.Image = filePath

	log.Println("Saving book to database...")

	bookID, err := h.BookService.AddBook(book)
	if err != nil {
		log.Println("Error adding book:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add book"})
		return
	}

	log.Println("Book added successfully with ID:", bookID)

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
