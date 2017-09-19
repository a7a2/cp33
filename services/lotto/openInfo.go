package servicesLotto

import (
	"cp33/common"
	"cp33/models"
	"fmt"
	"math"
	"strconv"
	"time"

	"github.com/go-redis/cache"
)

//t为type彩种 o为offset issue期号
func OpenData(t, o, l, issue int) *models.Data {
	strt := strconv.Itoa(t)
	stro := strconv.Itoa(o)
	strl := strconv.Itoa(l)
	strIssue := strconv.Itoa(issue)
	var err error
	u := models.Data{}

	err = common.Codec.Get("OpenData,t="+strt+"o="+stro+"l="+strl+"issue="+strIssue, &u)
	if err == nil {
		return &u
	}

	if issue <= 0 {
		err = models.Db.Model(&u).Where("type=?", t).Order("issue DESC").Limit(l).Select()
	} else {
		err = models.Db.Model(&u).Where("type=? and issue=?", t, issue).Order("issue DESC").Limit(l).Offset(o).Select()
	}

	if err == nil && u.Id > 0 { //存在 成功
		common.Codec.Set(&cache.Item{
			Key:        "OpenData,t=" + strt + "o=" + stro + "l=" + strl + "issue=" + strIssue,
			Object:     u,
			Expiration: time.Second,
		})
		return &u
	}

	return nil
}

func OpenInfo(t int) *models.Result { // 上一期开奖信息及当前可购买期号
	var err error
	var result models.Result
	lastPeriod := 0
	lastOpen := "" //上一期开奖号码
	currentPeriod := 0

	var d *models.Data
	d = OpenData(t, -1, 1, -1)
	if d == nil {
		fmt.Println("OpenInfo 33")
		lastPeriod = 0
	} else {
		lastOpen = d.Data
		lastPeriod = d.Issue //数据库内有数据的期号为上一期数据 即有开奖数据的那期绝对不能投了
	}

	err, lotto := GetLotteryViaGameId(t)
	if err != nil {
		return &models.Result{Code: 404, Message: "系统错误", Data: nil}
	}
	var delaySecond int = lotto.DelaySecond //截止投注前n秒

	dt := models.DataTime{}
	sTime := time.Now().Add(time.Second * time.Duration(delaySecond)).Format("15:04:05") //数据库检索时间

	//使用时间推算当前期期号,以此为准 start
	err = models.Db.Model(&dt).Where("type=? and action_time>?", t, sTime).Order("action_no").Limit(1).Select()
	if !(err == nil && dt.Type >= 0) {
		return &models.Result{Code: 404, Message: "系统错误", Data: nil}
	}
	switch t {
	case 1, 7: //重庆时时彩、西藏时时彩
		tmpCurrentPeriod, _ := strconv.Atoi(time.Now().Format("060102"))
		tmpCurrentPeriod = tmpCurrentPeriod * 1000
		currentPeriod = tmpCurrentPeriod + dt.ActionNo
	case 9: //pk10
		startPeriod := 640250 //2017-09-17 09:07
		startTime, _ := time.ParseInLocation("2006-01-02 15:04:05", "2017-09-17 00:00:00", time.Local)
		strAddPeriod := strconv.FormatFloat(math.Trunc(time.Now().Sub(startTime).Hours()/24)*179, 'g', 7, 64)
		intAddPeriod, _ := strconv.Atoi(strAddPeriod)
		currentPeriod = startPeriod + intAddPeriod + dt.ActionNo - 1
	}
	//使用时间推算当前期期号,以此为准 end

	periodCount := GetCountDataTimes(&t) //每天有几期
	lastPeriod = currentPeriod - 1
	switch t { //防止上去出现000期
	case 1, 7: //重庆时时彩、西藏时时彩
		tempNum := common.FindNum(lastPeriod, 1) + common.FindNum(lastPeriod, 2)*10 + common.FindNum(lastPeriod, 3)*100
		if tempNum == 0 {
			tmpLastPeriod, _ := strconv.Atoi(time.Now().AddDate(0, 0, -1).Format("060102"))
			tmpLastPeriod = tmpLastPeriod * 1000
			lastPeriod = tmpLastPeriod + (*periodCount)
		}
	}

	var timeleft int64 //剩余投注时间
	var ttActionTime time.Time
	ttActionTime, err = time.ParseInLocation("2006-01-02 15:04:05", time.Now().Format("2006-01-02")+" "+dt.ActionTime, time.Local)
	if err != nil {
		timeleft = 100000000
	}
	timeleft = ttActionTime.Unix() - time.Now().Local().Unix() - int64(delaySecond)

	if d != nil && d.Issue != lastPeriod { //d.Issue为基于开奖数据得到的期号 lastPeriod基于时间推算得到的期号 以后者为准，这个if为了减少一个数据库请求
		d = OpenData(t, 0, 1, lastPeriod)
		if d == nil {
			lastOpen = ""
		} else {
			lastOpen = d.Data
		}
	}

	out := (models.OpenInfo{Last_period: lastPeriod, Last_open: lastOpen, Current_period: currentPeriod, Current_period_status: "截止", Timeleft: timeleft, Type: t})
	result = models.Result{Code: 200, Message: "ok", Data: &out}

	return &result
}
