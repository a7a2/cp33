package common

import (
	"cp33/models"
	"fmt"

	"github.com/kataras/iris"
)

type BaseInfo struct { //基础信息
	Platform string `json:"platform"`
	Uuid     string `json:"uuid"`
}

func (self BaseInfo) Check(ctx iris.Context) {
	err := ctx.ReadForm(&self)
	if err != nil {
		fmt.Println(err.Error())
		ctx.JSON(models.Result{Code: 404, Message: "数据错误" + err.Error(), Data: nil})
		return
	}
	if self.Platform == "" || self.Uuid == "" {
		ctx.JSON(models.Result{Code: 404, Message: "数据错误!", Data: nil})
		return
	}
	return
}
