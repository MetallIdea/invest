package main

import (
	"net/http"
	"netdesk/modules/auth"
	"netdesk/modules/bonds"
	"netdesk/modules/candles"
	"netdesk/modules/favorites"
	"netdesk/modules/files"
	"netdesk/modules/permissions"
	"netdesk/modules/roles"
	"netdesk/modules/suggestions"
	"netdesk/modules/users"
	"os"

	"github.com/gin-gonic/gin"
)

func NewRouter() *gin.Engine {
	// Set the router as the default one shipped with Gin
	router := gin.Default()
	expectedHost := os.Getenv("EXPECTED_HOST")

	// Setup Security Headers
	router.Use(func(c *gin.Context) {
		if c.Request.Host != expectedHost {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid host header"})
			return
		}
		c.Header("X-Frame-Options", "DENY")
		c.Header("Content-Security-Policy", "default-src 'self'; connect-src *; font-src *; script-src-elem * 'unsafe-inline'; img-src * data:; style-src * 'unsafe-inline';")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
		c.Header("Referrer-Policy", "strict-origin")
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("Permissions-Policy", "geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()")
		c.Next()
	})

	router.Use(auth.AuthHandler())

	// Setup route group for the API
	api := router.Group("/api")
	{
		users.InitUsersModule(api)
		roles.InitModule(api)
		permissions.InitPermissionsModule(api)
		files.InitModule(api)

		bonds.InitModule(api)
		candles.InitModule(api)

		favorites.InitModule(api)
		suggestions.InitModule(api)
	}

	return router
}