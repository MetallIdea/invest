package workflows

import (
	"errors"
	"fmt"
	"netdesk/modules/bonds"
	"netdesk/modules/data"
	"netdesk/modules/tinvest"
	"netdesk/utils"
	"time"
)

func ActionGetAllBonds() (bool, error) {
	fmt.Println("Run action: Заспросить и сохранить облигации")

	allBonds := tinvest.GetAllBonds()

	if allBonds["error"] != nil {
		return false, errors.New(allBonds["error"].(string))
	}

	instruments := allBonds["instruments"].([]interface{})

	for _, value := range instruments {
		bond := value.(map[string]interface{})
		exist, err := bonds.GetBondByISIN(bond["isin"].(string))

		if err != nil {
			data.DB.Save(&bonds.InvestBond{
				ISIN: bond["isin"].(string),
			})
			exist, _ = bonds.GetBondByISIN(bond["isin"].(string))
		}

		var parsedMaturityDate time.Time
		if bond["maturityDate"] != nil {
			parsedMaturityDate, _ = time.Parse(time.RFC3339, bond["maturityDate"].(string))
		}
		initialNominal := bond["initialNominal"].(map[string]interface{})
		
		exist.ApiTradeAvailableFlag = bond["apiTradeAvailableFlag"].(bool)
		exist.BuyAvailableFlag = bond["buyAvailableFlag"].(bool)
		exist.CountryOfRisk = bond["countryOfRisk"].(string)
		exist.CountryOfRiskName = bond["countryOfRiskName"].(string)
		exist.FIGI = bond["figi"].(string)
		exist.Name = bond["name"].(string)
		exist.Sector = bond["sector"].(string)
		exist.Currency = bond["currency"].(string)
		exist.SellAvailableFlag = bond["sellAvailableFlag"].(bool)
		exist.Ticker = bond["ticker"].(string)
		exist.MaturityDate = parsedMaturityDate
		exist.InitialNominal, _ = utils.ParseFloat64(initialNominal["units"].(string))
		data.DB.Save(&exist)
	}

	return true, nil
}
