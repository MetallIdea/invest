package main

import (
	"log"
	"net/http"
	"netdesk/modules/data"
	"netdesk/modules/workflows"
	"os"
	"time"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	httpPort := os.Getenv("API_PORT")
	if httpPort == "" {
		httpPort = "8080"
	}

	data.InitDB()

	// Initialize router
	router := NewRouter()

	// Create server with timeout
	srv := &http.Server{
		Addr:    ":" + httpPort,
		Handler: router,
		// set timeout due CWE-400 - Potential Slowloris Attack
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("Start server: http://localhost:%v", httpPort)

	scheduler := workflows.RunScheduler()

	if err := srv.ListenAndServe(); err != nil {
		log.Printf("Failed to start server: %v", err)
	}

	if err := scheduler.Shutdown(); err != nil {
		log.Printf("Failed to stop scheduler: %v", err)
	}
}