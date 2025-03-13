package main

import (
	"backend/config"
	"backend/routes"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	config.InitDB()
	router := gin.Default()

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	routes.SetupRoutes(router)
	router.Run(":8080")
}
