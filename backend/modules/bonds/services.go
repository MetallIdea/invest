package bonds

import (
	"errors"
	"netdesk/modules/data"
)

func GetBondByISIN(isin string) (InvestBond, error) {
	var exist InvestBond
	result := data.DB.First(&exist, InvestBond{
		ISIN: isin,
	})

	if result.Error != nil {
		return exist, errors.New("Not found")
	}

	return exist, nil
}

func GetAllBonds() []InvestBond {
	var allBonds []InvestBond
	data.DB.Find(&allBonds)

	return allBonds
}