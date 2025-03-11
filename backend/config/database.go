package config

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

func SetUpDatabaseConnection() *sql.DB {
	if os.Getenv("APP_ENV") != constants.ENUM_RUN_PRODUCTION {
		if err := godotenv.Load(".env"); err != nil {
			panic(err)
		}
	}

	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbHost := os.Getenv("DB_HOST")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		dbHost, dbUser, dbPass, dbName, dbPort)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		panic(err)
	}

	if err := db.Ping(); err != nil {
		panic(err)
	}

	return db
}

func CloseDatabaseConnection(db *sql.DB) {
	if err := db.Close(); err != nil {
		panic(err)
	}
}
