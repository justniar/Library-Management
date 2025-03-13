package routes

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	auth := r.Group("/auth")
	{
		auth.POST("/register", controllers.Register)
		auth.POST("/login", controllers.Login)
	}

	protected := r.Group("/admin")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.GET("/dashboard", func(c *gin.Context) {
			role, _ := c.Get("role")
			if role != "admin" {
				c.JSON(403, gin.H{"error": "Access forbidden"})
				return
			}
			c.JSON(200, gin.H{"message": "Welcome Admin"})
		})
	}

	return r
}
