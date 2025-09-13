package favorites

import (
	"errors"
	"netdesk/modules/data"
)

func GetFavorites() (data.GetAllResult[Favorite], error) {
	var favorites data.GetAllResult[Favorite]
	result := data.DB.Find(&favorites.Data).Count(&favorites.TotalCount);

	if result.Error != nil {
		return favorites, errors.New("not found")
	}

	return favorites, nil
}