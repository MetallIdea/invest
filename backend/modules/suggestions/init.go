package suggestions

import (
	"netdesk/modules/data"

	"github.com/gin-gonic/gin"
)

func InitModule(api *gin.RouterGroup) {
	data.DB.AutoMigrate(&Suggestion{})
	
	api.GET("/suggestions", getSuggestions)
	api.GET("/suggestions/:id", data.GetById[Suggestion])
	api.POST("/suggestions", data.Save[Suggestion])
	api.DELETE("/suggestions/:id", data.Delete[Suggestion])
}