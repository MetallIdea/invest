package files

import (
	"log"
	"net/http"
	"netdesk/modules/data"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Получить текущего пользователя
type SaveFileResponse struct {
	ID int
	Name string
	Extension string
}

func saveFile(c *gin.Context) {
	file, err := c.FormFile("file")

	if err != nil {
		log.Print(err)
        c.Status(http.StatusBadRequest)
        return
    }

    extension := filepath.Ext(file.Filename)

	ex, err := os.Executable()
    if err != nil {
		log.Print(err)
        c.Status(http.StatusBadRequest)
        return
    }
    exPath := filepath.Dir(ex)

	newFile := NdFile{
		Name: file.Filename,
		Extension: extension,
	}

	data.DB.Model(&NdFile{}).Save(&newFile)

	c.SaveUploadedFile(file, exPath + "/files/" + strconv.Itoa(int(newFile.ID)))

	c.JSON(http.StatusOK, SaveFileResponse{
		ID: int(newFile.ID),
		Name: file.Filename,
		Extension: extension,
	})
}