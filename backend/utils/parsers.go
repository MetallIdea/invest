package utils

import "strconv"

func ParseUint(s string) (uint, error) {
	number, err := strconv.ParseUint(s, 10, 16)

	uintNumber := uint(number)

	return uintNumber, err
}

func ParseFloat64(s string) (float64, error) {
	return strconv.ParseFloat(s, 64)
}