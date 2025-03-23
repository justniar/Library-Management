package handler

import (
	"backend/models"
	service "backend/services"
	"backend/utils/jwt"
	"fmt"
	"log"
	"math"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
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

	limit := 8
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))

	if err != nil || page < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page number"})
		return
	}

	offset := (page - 1) * limit
	books, totalCount, err := h.BookService.GetAllBooks(limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get books"})
		return
	}

	totalPages := int(math.Ceil(float64(totalCount) / float64(limit)))
	c.JSON(http.StatusOK, gin.H{
		"books":        books,
		"total_books":  totalCount,
		"total_pages":  totalPages,
		"current_page": page,
	})
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

// func (h *BookHandler) UpdateBook(c *gin.Context) {
// 	var book models.Book
// 	bookID := c.Param("id")

// 	id, err := strconv.Atoi(bookID)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
// 		return
// 	}
// 	file, err := c.FormFile("image")
// 	if err == nil {
// 		log.Println("Updating with new image:", file.Filename)

// 		if _, err := os.Stat("uploads"); os.IsNotExist(err) {
// 			os.Mkdir("uploads", os.ModePerm)
// 		}

// 		uniqueFilename := fmt.Sprintf("%d-%s", time.Now().UnixNano(), file.Filename)
// 		filePath := filepath.Join("uploads", uniqueFilename)

// 		if err := c.SaveUploadedFile(file, filePath); err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
// 			return
// 		}

// 		oldBook, err := h.BookService.GetBookDetails(id)
// 		if err == nil && oldBook.Image != "" {
// 			os.Remove(oldBook.Image)
// 		}

// 		book.Image = filePath
// 	}

// 	book.ID = id

// 	if err := c.JSON(&book); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if err := h.BookService.UpdateBook(book); err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update book"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"message": "Book updated successfully"})
// }

func (h *BookHandler) UpdateBook(c *gin.Context) {
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

	bookID := c.Param("id")
	id, err := strconv.Atoi(bookID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
		return
	}

	oldBook, err := h.BookService.GetBookDetails(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}

	book := oldBook
	book.ID = id

	file, err := c.FormFile("image")
	if err == nil {
		log.Println("Updating with new image:", file.Filename)

		if _, err := os.Stat("uploads"); os.IsNotExist(err) {
			os.Mkdir("uploads", os.ModePerm)
		}

		uniqueFilename := fmt.Sprintf("%d-%s", time.Now().UnixNano(), file.Filename)
		filePath := filepath.Join("uploads", uniqueFilename)

		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}

		if oldBook.Image != "" {
			os.Remove(oldBook.Image)
		}

		book.Image = filePath
	}

	book.Title = c.PostForm("title")
	book.Author = c.PostForm("author")
	book.Category = c.PostForm("category")
	book.Publisher = c.PostForm("publisher")
	book.Language = c.PostForm("language")
	book.Description = c.PostForm("description")
	book.ISBN = c.PostForm("isbn")

	if publicationYearStr := c.PostForm("publication_year"); publicationYearStr != "" {
		publicationYear, err := strconv.Atoi(publicationYearStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid publication year"})
			return
		}
		book.PublicationYear = publicationYear
	}

	if pagesStr := c.PostForm("pages"); pagesStr != "" {
		pages, err := strconv.Atoi(pagesStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page count"})
			return
		}
		book.Pages = pages
	}

	if stockStr := c.PostForm("stock"); stockStr != "" {
		stock, err := strconv.Atoi(stockStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid stock value"})
			return
		}
		book.Stock = stock
	}

	if err := h.BookService.UpdateBook(*book); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update book"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Book updated successfully"})
}

func (h *BookHandler) DeleteBook(c *gin.Context) {
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
