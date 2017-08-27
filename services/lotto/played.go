package servicesLotto

import (
	"cp33/common"
	"cp33/models"
	"strconv"
	"time"

	"github.com/go-redis/cache"
)

func Played(platformId, intPlayId, intSubId int) *models.Played {
	played := models.Played{}
	err := common.Codec.Get("Db_played_subid="+strconv.Itoa(intSubId)+"platformId="+strconv.Itoa(platformId), &played)
	if err == nil {
		return &played
	}
	err = models.Db.Model(&played).Where("group_id=? and platform_id=? and sub_id=?", intPlayId, platformId, intSubId).Limit(1).Select()
	if err == nil && played.Id > 0 {
		common.Codec.Set(&cache.Item{
			Key:        "Db_played_subid=" + strconv.Itoa(intSubId) + "platformId=" + strconv.Itoa(platformId),
			Object:     played,
			Expiration: time.Hour,
		})
	}
	return &played
}
