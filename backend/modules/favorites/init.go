package favorites

import (
	"netdesk/modules/data"

	"github.com/gin-gonic/gin"
)

func InitModule(api *gin.RouterGroup) {
	data.DB.AutoMigrate(&Favorite{})
	
	api.GET("/favorites", getFavorites)
	api.GET("/favorites/:id", data.GetById[Favorite])
	api.POST("/favorites", data.Save[Favorite])
	api.DELETE("/favorites/:id", data.Delete[Favorite])
}