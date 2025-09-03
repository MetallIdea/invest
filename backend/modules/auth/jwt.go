package auth

import (
	"github.com/golang-jwt/jwt/v5"
)

// Секретный ключ для подписи JWT-токена
// Необходимо хранить в безопасном месте
var jwtSecretKey = []byte("very-secret-key")

func GetJWTFromClaims(payload *jwt.MapClaims) (string, error) {
    // Создаем новый JWT-токен и подписываем его по алгоритму HS256
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, payload)

    t, err := token.SignedString(jwtSecretKey)
	
	return t, err
}


func GetClaimsFromJWT(payload string) (jwt.MapClaims, error) {
	// Parse takes the token string and a function for looking up the key. The latter is especially
	// useful if you use multiple keys for your application.  The standard is to use 'kid' in the
	// head of the token to identify which key to use, but the parsed token (head and claims) is provided
	// to the callback, providing flexibility.
	token, err := jwt.Parse(payload, func(token *jwt.Token) (interface{}, error) {
		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return jwtSecretKey, nil
	}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))

	if err != nil {
		return nil, err
	}

	claims := token.Claims.(jwt.MapClaims);
	
	return claims, err
}