package data

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type GetAllParams struct {
	Where string `form:"where"`
	Limit int `form:"limit"`
	Order string `form:"order"`
}

type GetAllResult[T interface{}] struct {
	Data []T
	TotalCount int64
}

func GetAll[T interface{}](c *gin.Context) {
	var params GetAllParams
	c.Bind(&params)

	if params.Limit == 0 {
		params.Limit = -1
	}

	var data []T
	var count int64

	err := DB.Where(params.Where).Order(params.Order).Limit(params.Limit).Find(&data).Count(&count)
	
	if err != nil {
		c.JSON(http.StatusOK, GetAllResult[T]{ Data: data, TotalCount: count })
	}
}

func GetById[T interface{}](c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	var data T

	result := DB.Where("id = ?", id).First(&data)
	
	if result.Error == nil {
		c.JSON(http.StatusOK, data)
	} else {
		c.Status(http.StatusNotFound)
	}
}

func Save[T interface{}](c *gin.Context) {
	var newData []T
	c.Bind(&newData)

	result := DB.Save(&newData)
	
	if result.Error == nil {
		c.JSON(http.StatusOK, newData)
	} else {
		c.Status(http.StatusNotFound)
	}
}

func Delete[T interface{}](c *gin.Context) {
	var deleteData T
	id, _ := strconv.Atoi(c.Param("id"))

	result := DB.Where("id = ?", id).Delete(&deleteData)
	
	if result.Error == nil && result.RowsAffected > 0 {
		c.Status(http.StatusOK)
	} else {
		c.Status(http.StatusNotFound)
	}
}

func GetUserFromContext(c *gin.Context) *NdUser {
	userData, ok := c.Get("user")
	if ok {
		return userData.(*NdUser)
	}

	return nil
}