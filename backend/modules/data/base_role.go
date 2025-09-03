package data

import "gorm.io/gorm"

type NdRole struct {
	gorm.Model
	Name  string
	Title  string
	Description string
}