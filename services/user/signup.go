package services

import (
	"cp33/models"
	"cp33/services/pingtais"
	"fmt"
	"time"

	"github.com/go-pg/pg"
)

func Signup(platform, username, password, intr, ip string) (err error, result models.Result) {
	u := models.Members{}
	err = models.Db.Model(&u).Where("platform=? and username=?", platform, username).Limit(1).Select()
	if err == nil && u.Uid >= 0 { //账号存在
		result = models.Result{Code: 201, Message: fmt.Sprintf("账号'%s'已经存在!", username), Data: nil}
		return
	}
	platformId := servicesPingtais.GetPlatformId(platform)

	//	ce45035d-317e-4831-afe1-05444d9b040a
	u = models.Members{
		PlatformId: platformId,
		Username:   username,
		Password:   password,
		ParentId:   1, //...
		//Parents:arrayParents,
		Type:       1, //会员
		RegIp:      ip,
		RegTime:    time.Now().Format("2006-01-02 15:04:05"),
		UpdateTime: time.Now().Format("2006-01-02 15:04:05"),
	}

	var tx *pg.Tx
	tx, err = models.Db.Begin()
	if err != nil {
		result = models.Result{Code: 500, Message: err.Error(), Data: nil}
		return
	}

	//var stmt *pg.Stmt
	err = tx.Insert(&u)
	if err != nil {
		fmt.Println(err.Error())
		tx.Rollback()
		result = models.Result{Code: 600, Message: "数据库错误!", Data: &u}
		return
	}

	err = tx.Commit()
	if err != nil {
		fmt.Println(err.Error())
		result = models.Result{Code: 600, Message: "数据库错误!", Data: &u}
		return
	}
	result = models.Result{Code: 200, Message: "ok,注册成功！", Data: nil}
	return
}
