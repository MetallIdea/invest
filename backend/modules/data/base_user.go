package data

import "gorm.io/gorm"

type NdUser struct {
	gorm.Model
	Login string
	Password string
	Name  string
	Email string `gorm:"uniqueIndex"`
	Roles []NdRole `gorm:"many2many:nd_users_roles_nd_roles;"`
}