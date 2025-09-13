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
		return exist, errors.New("not found")
	}

	return exist, nil
}

func GetCandlesByPeriod(instrumentId string, startTime string, endTime string) ([]InvestCandle, error) {
	var exist []InvestCandle
	result := data.DB.Where("time BETWEEN ?, ? AND  instrument_id = ?", startTime, endTime, instrumentId).Find(&exist)

	if result.Error != nil {
		return exist, errors.New("not found")
	}

	return exist, nil
}