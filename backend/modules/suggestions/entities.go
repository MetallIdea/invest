package suggestions

import (
	"time"

	"gorm.io/gorm"
)

type Suggestion struct {
	gorm.Model

	Type string
	InstrumentId string
	SellPrice float64
	BuyPrice float64
	Time time.Time
	SuccessPercent float64
	Description string
}