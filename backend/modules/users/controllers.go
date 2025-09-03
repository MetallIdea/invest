package users

import (
	"net/http"
	"netdesk/modules/auth"
	"netdesk/modules/data"
	"netdesk/utils"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// Получить пользователя по id
type UserResponse struct {
	Name string `form:"name"`
	Email string
}

func getUserById(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	user := data.GetUserFromContext(c);

	result := findUserById(id, user)

	if (result == nil) {
		c.Status(http.StatusNotFound)
		return
	}

	c.JSON(http.StatusOK, UserResponse{
		Name: result.Name,
		Email: result.Email,
	})
}

// Получить текущего пользователя
type CurrentUserResponse struct {
	Name string `form:"name"`
	Email string
	Roles []RoleDto
}

func getCurrentUser(c *gin.Context) {
	user := data.GetUserFromContext(c);

	c.JSON(http.StatusOK, CurrentUserResponse{
		Name: user.Name,
		Email: user.Email,
		Roles: utils.Map(user.Roles, MapToRoleDto),
	})
}

// Создать пользователя
type (
	RegisterUserRequest struct {
		Name string `form:"name"`
	}
	
	RegisterUserResponse struct {
		Name string `form:"name"`
	}
)

func registerUser(c *gin.Context) {
	var user RegisterUserRequest
	c.Bind(&user)
	c.JSON(http.StatusOK, gin.H{
		"message": user.Name,
	})
}

// Авторизация
type (
	LoginUserRequest struct {
		Email string
		Password string
	}
	
	LoginUserResponse struct {
		AccessToken string
	}
)

func loginUser(c *gin.Context) {
	var userRequest LoginUserRequest
	c.Bind(&userRequest)

	user := findUserByEmailAndPassword(userRequest.Email, userRequest.Password)

	if user == nil {
		c.Status(http.StatusForbidden)
		return
	}

    t, err := auth.GetJWTFromClaims(&jwt.MapClaims{
        "id":  user.ID,
        "exp":  time.Now().Add(time.Hour * 72).Unix(),
    })

    if err != nil {
		c.Status(http.StatusForbidden)
		return
    }

	// Кука на 30 дней
	c.SetCookie("user", t, 2592000, "/", "", true, true)
	c.JSON(http.StatusOK, LoginUserResponse{AccessToken: t})
}