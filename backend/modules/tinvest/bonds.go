package tinvest

import (
	"fmt"
	"netdesk/utils"
	"os"
)

func GetAllBonds() map[string]interface{} {
	return utils.Request[map[string]interface{}](utils.RequestParams{
		Method: "POST",
		Url: "https://sandbox-invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/Bonds",
		Headers: map[string]string{
			"Authorization": fmt.Sprintf("Bearer %s", os.Getenv("INVEST_TOKEN")),
			"Content-Type": "application/json",
		},
		Body: "{\"instrumentStatus\": \"INSTRUMENT_STATUS_UNSPECIFIED\",\"instrumentExchange\": \"INSTRUMENT_EXCHANGE_UNSPECIFIED\"}",
	});
}