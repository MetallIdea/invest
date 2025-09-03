package bonds

import (
	"netdesk/modules/data"

	"github.com/gin-gonic/gin"
)

func InitModule(api *gin.RouterGroup) {
	data.DB.AutoMigrate(&InvestBond{})
	
	api.GET("/bonds", data.GetAll[InvestBond])
	api.GET("/bonds/:id", data.GetById[InvestBond])
	api.POST("/bonds", data.Save[InvestBond])
	api.DELETE("/bonds/:id", data.Delete[InvestBond])
}