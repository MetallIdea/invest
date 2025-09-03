package data

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
    dsn := os.Getenv("DB_CONNECT")
    session, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if (err != nil) {
		log.Fatal(err)
	}

	DB = session
}