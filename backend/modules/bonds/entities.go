package bonds

import (
	"time"

	"gorm.io/gorm"
)

type InvestBond struct {
	gorm.Model

	CountryOfRisk     string
	CountryOfRiskName string
	SellAvailableFlag bool
	Sector            string
	Name              string
	Currency          string
	MaturityDate      time.Time
	InitialNominal    float64

	BuyAvailableFlag      bool
	Ticker                string
	ApiTradeAvailableFlag bool
	MinPriceIncrement     uint
	ISIN                  string
	FIGI                  string
}