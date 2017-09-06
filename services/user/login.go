package services

import (
	"cp33/models"
	"cp33/services/pingtais"
	"errors"
	//"fmt"
	//	"gopkg.in/pg.v5"
)

func Login(platform, username, password string) (err error, result models.Result) {
	u := models.Members{}
	err = models.Db.Model(&u).Where("platform_id=? and username=? and password=?", servicesPingtais.GetPlatformId(platform), username, password).Limit(1).Select()
	//fmt.Println(u.Uid)
	if err == nil && u.Uid >= 0 { //存在 成功
		result = models.Result{Code: 200, Message: "ok", Data: &u}
		return
	} else if err != nil {
		result = models.Result{Code: 400, Message: err.Error(), Data: nil}
		return
	} else {
		err = errors.New("记录不存在！")
		result = models.Result{Code: 404, Message: "error!", Data: nil}
		return
	}

	return
}

func GetUid(platform, username string) int {
	u := models.Members{}
	err := models.Db.Model(&u).Where("platform_id=? and username=?", servicesPingtais.GetPlatformId(platform), username).Limit(1).Returning("uid").Select()
	//fmt.Println(u.Uid)
	if err == nil && u.Uid >= 0 { //存在 成功
		return u.Uid
	}

	return 0
}
