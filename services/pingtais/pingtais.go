package servicesPingtais

import (
	"cp33/common"
	"cp33/models"
	"time"

	"github.com/go-redis/cache"
)

func GetPlatformId(platform *string) *int {
	u := models.Pingtai{}
	var id int
	err := common.Codec.Get("GetPlatformId="+(*platform), &id)
	if err == nil {
		return &id
	}
	err = models.Db.Model(&u).Where("platform=?", *platform).Limit(1).Returning("uid").Select()
	if err == nil && u.Id >= 1 { //存在
		common.Codec.Set(&cache.Item{
			Key:        "GetPlatformId=" + (*platform),
			Object:     u.Id,
			Expiration: time.Hour,
		})
		return &u.Id
	}

	return nil
}
