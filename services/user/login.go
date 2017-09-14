package services

import (
	"cp33/common"
	"cp33/models"
	"cp33/services/pingtais"
	"errors"

	"time"

	"github.com/go-redis/cache"
)

func Login(lp *models.LoginPost) (err error, result models.Result) {
	u := models.Members{}
	//fmt.Println((*lp).Platform)
	err = models.Db.Model(&u).Where("platform_id=? and username=? and password=?", *servicesPingtais.GetPlatformId(&(*lp).Platform), (*lp).Username, (*lp).Password).Limit(1).Select()

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

func GetUidViaPlatformAndUsername(platform, username *string) *int {
	u := models.Members{}
	var uid int
	err := common.Codec.Get("GetUidViaPlatformAndUsername_"+(*platform)+"_"+(*username), &uid)
	if err == nil {
		return &uid
	}
	err = models.Db.Model(&u).Where("platform_id=? and username=?", *servicesPingtais.GetPlatformId(platform), username).Limit(1).Returning("uid").Select()
	if err == nil && u.Uid >= 0 { //存在 成功
		common.Codec.Set(&cache.Item{
			Key:        "GetUidViaPlatformAndUsername_" + (*platform) + "_" + (*username),
			Object:     u.Uid,
			Expiration: time.Hour,
		})
		return &(u.Uid)
	}

	return nil
}

func GetUidViaUuid(uuid *string) *int {
	u := models.Members{}
	var uid int
	err := common.Codec.Get("GetUidViaUuid_"+(*uuid), &uid)
	if err == nil {
		return &uid
	}
	err = models.Db.Model(&u).Where("uuid=?", *uuid).Limit(1).Returning("uid").Select()
	if err == nil && u.Uid >= 0 { //存在 成功
		common.Codec.Set(&cache.Item{
			Key:        "GetUidViaUuid_" + (*uuid),
			Object:     u.Uid,
			Expiration: time.Hour,
		})
		return &(u.Uid)
	}

	return nil
}

func GetParentIdViaUid(uid *int) *int {
	u := models.Members{}
	var parentId int
	err := common.Codec.Get("GetParentIdViaUid_"+string(*uid), &parentId)
	if err == nil {
		return &parentId
	}
	err = models.Db.Model(&u).Where("uid=?", *uid).Limit(1).Returning("uid").Select()
	if err == nil && u.Uid >= 0 { //存在 成功
		common.Codec.Set(&cache.Item{
			Key:        "GetParentIdViaUid_" + string(*uid),
			Object:     u.ParentId,
			Expiration: time.Hour,
		})
		return &(u.ParentId)
	}

	return nil
}
