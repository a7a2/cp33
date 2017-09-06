package servicesLotto

import (
	"cp33/common"
	"cp33/models"

	"strconv"
	"time"

	"github.com/go-redis/cache"
)

func PlayedGroup(intPlayId int) *models.PlayedGroup {
	playedGroup := models.PlayedGroup{}
	err := common.Codec.Get("Db_playedgroup="+strconv.Itoa(intPlayId), &playedGroup)
	if err == nil {
		return &playedGroup
	}
	err = models.Db.Model(&playedGroup).Where("type=? and enable=true", intPlayId).Limit(1).Select()
	if err == nil && playedGroup.Id > 0 {
		common.Codec.Set(&cache.Item{
			Key:        "Db_playedgroup=" + strconv.Itoa(intPlayId),
			Object:     playedGroup,
			Expiration: time.Hour,
		})
	}
	return &playedGroup
}
