package files

import (
	"gorm.io/gorm"
)

type NdFile struct {
	gorm.Model

	Name string
	Extension string
	Size int64
	Mimetype string
}