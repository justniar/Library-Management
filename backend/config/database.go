package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASS"),
		os.Getenv("DB_NAME"), os.Getenv("DB_PORT"),
	)

	DB, err = sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("Database connection error:", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("Database ping error:", err)
	}

	fmt.Println("Database connected successfully!")
}
