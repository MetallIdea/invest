package users

import (
	"netdesk/modules/data"

	"github.com/gin-gonic/gin"
)

func InitUsersModule(api *gin.RouterGroup) {
	data.DB.AutoMigrate(&data.NdUser{})

	api.GET("/users/:id", getUserById)
	api.GET("/users/current", getCurrentUser)
	api.POST("/users/register", registerUser)
	api.POST("/users/login", loginUser)
}