package permissions

import (
	"netdesk/modules/data"
	"slices"

	"gorm.io/gorm"
)

func AddPermissionCondition(query *gorm.DB, entityType string, currentUser *data.NdUser) {
	if currentUser == nil {
		query.Joins("inner join nd_permissions p on p.type = ? and p.read and p.user_id is null", entityType)
		return
	}

	if slices.ContainsFunc(currentUser.Roles, func(role data.NdRole) bool { return role.Name == "Admin"}) {
		return
	}

	query.Joins("inner join nd_permissions p on p.type = '?' and p.read and p.user_id = ?", entityType, currentUser.ID)
}