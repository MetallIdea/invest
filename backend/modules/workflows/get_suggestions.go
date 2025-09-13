package workflows

import (
	"fmt"
	"netdesk/modules/bonds"
	"netdesk/modules/candles"
	"netdesk/modules/data"
	"time"
)

func ActionGetSuggestions() (bool, error) {
	fmt.Println("Run action: Сделать предложения")

	startTime := time.Now()

	allBonds := bonds.GetAllBonds()

	bestVolumeStar := 0
	bestDiffCandles := 0

	for _, bond := range allBonds {
		for i := 0; i < 12; i++ {
			toTimeString := startTime.AddDate(0, -i, 0).Format(time.RFC3339)
			fromTimeString := startTime.AddDate(0, -i - 1, 0).Format(time.RFC3339)
			results, _ := candles.GetCandlesByPeriod(bond.FIGI, fromTimeString, toTimeString)

			for i, candle := range results {
				var candle1Day, candle2Day candles.InvestCandle
				if i > 1 {
					candle1Day = results[i-1]
				}
				if i > 2 {
					candle2Day = results[i-2]
				}
			}
		}
	}

	return true, nil
}
