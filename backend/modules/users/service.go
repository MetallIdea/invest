package users

import (
	"netdesk/modules/auth"
	"netdesk/modules/data"
	"netdesk/modules/permissions"
)

func findUserById(id int, currentUser *data.NdUser) *data.NdUser {
	var user data.NdUser

	query := data.DB.Select("nd_users.id", "name", "email", "p.user_id")

	permissions.AddPermissionCondition(query, "users", currentUser)
	
	result := query.First(&user, "nd_users.id = ?", id)

	if (result.Error != nil) {
		return nil
	}

	return &user
}

func findUserByEmailAndPassword(email string, password string) *data.NdUser {
	var user data.NdUser

	result := data.DB.Select("id", "name", "email").Where("email = ? and password = ?", email, auth.GetMD5Hash(password)).First(&user)

	if (result.Error != nil) {
		return nil
	}

	return &user
}