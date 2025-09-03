package utils

import (
	"github.com/expr-lang/expr"
)

func Execute(code string, context map[string]interface{}) (any, error) {
	program, err := expr.Compile(code, expr.Env(context))
	if err != nil {
		return nil, err
	}

	return expr.Run(program, context)
}
