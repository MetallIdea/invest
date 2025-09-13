package favorites

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func getFavorites(c *gin.Context) {
	favorites, err := GetFavorites();
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
	}

	c.JSON(http.StatusOK, favorites)
}