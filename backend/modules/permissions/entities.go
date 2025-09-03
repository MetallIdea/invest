package permissions

import (
	"netdesk/modules/data"
)

type NdPermission struct {
	data.NdBasePermissions

	Type string
	ItemId int
}