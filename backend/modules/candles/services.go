package candles

import (
	"errors"
	"netdesk/modules/data"
	"time"
)

func GetCandleByTime(instrumentId string, time time.Time) (InvestCandle, error) {
	var exist InvestCandle
	result := data.DB.First(&exist, InvestCandle{
		InstrumentId: instrumentId,
		Time:         time,
	})

	if result.Error != nil {
		return exist, errors.New("Not found")
	}

	return exist, nil
}