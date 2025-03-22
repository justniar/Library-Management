package handler

import (
	service "backend/services"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	UserService *service.UserService
}

func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{UserService: userService}
}

func (h *UserHandler) GetAllUser(c *gin.Context) {
	users, err := h.UserService.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get users"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"users": users,
	})
}

func (h *UserHandler) GetUserDetails(c *gin.Context) {
	userID := c.Param("id")
	log.Println("Received user ID:", userID)

	id, err := strconv.Atoi(userID)
	if err != nil {
		log.Println("Invalid user ID:", userID)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	user, err := h.UserService.GetUserDetails(id)
	log.Println("user not found with ID:", id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user details not found"})
		return
	}
	log.Println("Returning user details:", user)
	c.JSON(http.StatusOK, user)
}
