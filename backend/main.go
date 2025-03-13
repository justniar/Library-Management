package main

import (
	"backend/routes"
)

func main() {
	config.ConnectDatabase()

	r := routes.SetupRouter()
	r.Run(":8080")
}
