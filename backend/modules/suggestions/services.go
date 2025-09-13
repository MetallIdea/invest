package suggestions

import (
	"errors"
	"netdesk/modules/data"
)

func GetSuggestionsByDate() (data.GetAllResult[Suggestion], error) {
	var suggestions data.GetAllResult[Suggestion]
	result := data.DB.Find(&suggestions.Data).Count(&suggestions.TotalCount);

	if result.Error != nil {
		return suggestions, errors.New("not found")
	}

	return suggestions, nil
}