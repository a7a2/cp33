package servicesPingtais

import (
	//"cp33/common"
	"cp33/models"
)

func GetPlatformId(platform string) int {
	u := models.Pingtai{}

	err := models.Db.Model(&u).Where("platform=?", platform).Limit(1).Returning("uid").Select()

	if err == nil && u.Id >= 1 { //存在
		return u.Id
	}

	return 0
}
