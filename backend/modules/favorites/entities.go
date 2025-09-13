package favorites

import (
	"gorm.io/gorm"
)

type Favorite struct {
	gorm.Model

	Type string
	InstrumentId string
}