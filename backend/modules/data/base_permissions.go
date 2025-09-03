package data

import (
	"gorm.io/gorm"
)

type NdBasePermissions struct {
	gorm.Model
	Read bool
	Create bool
	Update  bool
	Delete  bool
	UserId int
	RoleId int
}