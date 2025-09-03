package workflows

import (
	"fmt"
	"math"
	"netdesk/modules/bonds"
	"netdesk/modules/candles"
	"netdesk/modules/data"
	"netdesk/modules/tinvest"
	"netdesk/utils"
	"time"
)

func parseValue(value map[string]interface{}, initNominal float64) float64 {
	var percent float64
	var nano float64
	if value != nil {
		percent, _ = utils.ParseFloat64(value["units"].(string))
		nano = value["nano"].(float64)
	}

	return initNominal * percent / 100 + (nano / 100000000)
}

func isStar(candle candles.InvestCandle) bool {
	if (candle.Diff > 1) {
		return false
	}

	highDiff := candle.High - candle.Close
	lowDiff := candle.Low - candle.Open

	diffPercent := math.Abs(100 - highDiff * 100 / lowDiff)

	if (diffPercent > 2) {
		return false
	}

	return true
}

func ActionGetAllCandles() (bool, error) {
	fmt.Println("Run action: Заспросить и сохранить свечи")

	startTime := time.Now()

	allBonds := bonds.GetAllBonds()

	for _, bond := range allBonds {
		for i := 0; i < 12; i++ {
			toTimeString := startTime.AddDate(0, -i, 0).Format(time.RFC3339)
			fromTimeString := startTime.AddDate(0, -i - 1, 0).Format(time.RFC3339)
			result := tinvest.GetBondCandlesByTime(tinvest.GetBondCandlesByTimeParams{
				BondFigi: bond.FIGI,
				From: fromTimeString,
				To: toTimeString,
				Interval: "CANDLE_INTERVAL_DAY",
			})

			var prevCandle candles.InvestCandle

			if result["candles"] != nil {
				allCandles := result["candles"].([]interface{})

				for _, value := range allCandles {
					candle := value.(map[string]interface{})

					parsedTime, _ := time.Parse(time.RFC3339, candle["time"].(string))
					
					exist, err := candles.GetCandleByTime(bond.FIGI, parsedTime)
				
					if err != nil {
						data.DB.Save(&candles.InvestCandle{
							InstrumentId: bond.FIGI,
							Time: parsedTime,
						})
						
						exist, _ = candles.GetCandleByTime(bond.FIGI, parsedTime)
					}

					exist.Open = parseValue(candle["open"].(map[string]interface{}), bond.InitialNominal)
					exist.Close = parseValue(candle["close"].(map[string]interface{}), bond.InitialNominal)
					exist.High = parseValue(candle["high"].(map[string]interface{}), bond.InitialNominal)
					exist.Low = parseValue(candle["low"].(map[string]interface{}), bond.InitialNominal)
					exist.Diff =  100 - exist.Close * 100 / exist.Open
					if prevCandle.ID != 0 {
						exist.DiffDay = 100 - prevCandle.Close * 100 / exist.Close
					}

					data.DB.Save(exist)

					prevCandle = exist
				}
			}
		}
	}

	return true, nil
}
