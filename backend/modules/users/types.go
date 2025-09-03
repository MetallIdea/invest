package users

import "netdesk/modules/data"

type RoleDto struct {
	Id    uint
	Title string
	Name  string
}

func MapToRoleDto(role data.NdRole) RoleDto {
	return RoleDto{Id: role.ID, Title: role.Title, Name: role.Name}
}