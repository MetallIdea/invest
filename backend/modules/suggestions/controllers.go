package suggestions

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func getSuggestions(c *gin.Context) {
	favorites, err := GetSuggestionsByDate();
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
	}

	c.JSON(http.StatusOK, favorites)
}