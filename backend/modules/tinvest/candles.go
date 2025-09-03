package tinvest

import (
	"fmt"
	"netdesk/utils"
	"os"
)

type GetBondCandlesByTimeParams struct {
	BondFigi string
	From string
	To string
	Interval string
}

func GetBondCandlesByTime(params GetBondCandlesByTimeParams) map[string]interface{} {
	body := fmt.Sprintf(
		"{\"from\": \"%s\",\"to\": \"%s\", \"interval\": \"%s\", \"instrumentId\": \"%s\",\"candleSourceType\": \"CANDLE_SOURCE_UNSPECIFIED\",\"limit\":366}",
		params.From,
		params.To,
		params.Interval,
		params.BondFigi,
	)
	
	return utils.Request[map[string]interface{}](utils.RequestParams{
		Method: "POST",
		Url: "https://sandbox-invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.MarketDataService/GetCandles",
		Headers: map[string]string{
			"Authorization": fmt.Sprintf("Bearer %s", os.Getenv("INVEST_TOKEN")),
			"Content-Type": "application/json",
		},
		Body: body,
	});
}