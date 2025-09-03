package permissions

import (
	"netdesk/modules/data"

	"github.com/gin-gonic/gin"
)

func InitPermissionsModule(api *gin.RouterGroup) {
	data.DB.AutoMigrate(&NdPermission{})
}