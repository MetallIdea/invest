package roles

import (
	"netdesk/modules/data"

	"github.com/gin-gonic/gin"
)

func InitModule(api *gin.RouterGroup) {
	data.DB.AutoMigrate(&data.NdRole{})

	api.GET("/roles", data.GetAll[data.NdRole])
	api.GET("/roles/:id", data.GetById[data.NdRole])
	api.POST("/roles", data.Save[data.NdRole])
	api.DELETE("/roles/:id", data.Delete[data.NdRole])
}