package services

import (
	"container/list"
	"cp33/models"
	"cp33/services/pingtais"
	"fmt"
	"time"

	"github.com/go-pg/pg"
)

func Signup(s *models.SignupPost, ip string) (err error, result models.Result) {
	uOne := models.Members{}
	platformId := *servicesPingtais.GetPlatformId(&(*s).Platform)
	err = models.Db.Model(&uOne).Where("platform_id=? and username=?", platformId, (*s).Username).Limit(1).Select()
	if err == nil && uOne.Uid >= 0 { //账号存在
		result = models.Result{Code: 201, Message: fmt.Sprintf("账号'%s'已经存在!", (*s).Username), Data: nil}
		return
	}

	var parentId int
	var uid *int
	arrayParents := make([]int, 0)
	tmpParentId := GetUidViaUuid(&(*s).Uuid)

	if tmpParentId != nil {
		parentId = *tmpParentId
		l := list.New()
		l.PushBack(parentId)
		*uid = parentId
		uid = GetParentIdViaUid(uid)
		for uid != nil {
			l.PushBack(*uid)
			uid = GetParentIdViaUid(uid)
		}
		for l.Len() > 0 {
			i1 := l.Back()
			l.Remove(i1)
			value, ok := i1.Value.(int)
			if !ok {
				fmt.Println("It's not ok for type int")
				return
			}
			arrayParents = append(arrayParents, value)
		}
	}
	fmt.Println((*s).Password)
	//	ce45035d-317e-4831-afe1-05444d9b040a
	u := models.Members{
		PlatformId: platformId,
		Username:   (*s).Username,
		Password:   (*s).Password,
		ParentId:   parentId,
		Parents:    arrayParents,
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
		fmt.Println("services Signup 72" + err.Error())
		tx.Rollback()
		result = models.Result{Code: 600, Message: "数据库错误!", Data: &u}
		return
	}

	err = tx.Commit()
	if err != nil {
		fmt.Println("services Signup 80" + err.Error())
		result = models.Result{Code: 600, Message: "数据库错误!", Data: &u}
		return
	}
	result = models.Result{Code: 200, Message: "ok,注册成功！", Data: &u}
	return
}
