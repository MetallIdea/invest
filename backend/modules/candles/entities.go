package candles

import (
	"time"

	"gorm.io/gorm"
)

type InvestCandle struct {
	gorm.Model

	InstrumentId string
	Interval string

	Time time.Time
	Open float64
	Close float64
	Diff float64
	DiffDay float64
	CandleType string
	Low float64
	High float64
	Volume uint
	IsComplete bool
}