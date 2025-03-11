package main

import (
	"backend/config"
	"backend/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	config.InitDB()
	router := gin.Default()

	routes.SetupRoutes(router)

	router.Run(":8080")
}
