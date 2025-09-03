package candles

import (
	"netdesk/modules/data"

	"github.com/gin-gonic/gin"
)

func InitModule(api *gin.RouterGroup) {
	data.DB.AutoMigrate(&InvestCandle{})
	
	api.GET("/candles", data.GetAll[InvestCandle])
	api.GET("/candles/:id", data.GetById[InvestCandle])
	api.POST("/candles", data.Save[InvestCandle])
	api.DELETE("/candles/:id", data.Delete[InvestCandle])
}