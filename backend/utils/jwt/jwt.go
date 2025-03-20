package jwt

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var secretKey = []byte("sdfghhjkjlkjhgfdssadfghjhhgfds")

func GenerateToken(email, role, username string) (string, error) {
	claims := jwt.MapClaims{
		"email":    email,
		"role":     role,
		"username": username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secretKey)
}
