package main

import (
	"cp33/models"
	_ "cp33/router"

	"github.com/kataras/iris"
	"github.com/kataras/iris/middleware/recover"
)

func main() {
	models.App.Use(recover.New())
	models.App.Run(iris.Addr(":8080"), iris.WithoutServerError(iris.ErrServerClosed))
}
