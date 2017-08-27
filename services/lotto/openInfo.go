package servicesLotto

import (
	"cp33/common"
	"cp33/models"
	"fmt"
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

func OpenInfo(t int) (err error, result models.Result) { // 上一期开奖信息及当前可购买期号
	last_period := 0
	current_period := 0
	var delaySecond int = 10 //截止投注前n秒
	var d *models.Data
	d = OpenData(t, -1, 1, -1)
	if d == nil {
		fmt.Println("OpenInfo 33")
		return
	}

	last_period = d.Issue //数据库内有数据的期号为上一期数据 即有开奖数据的那期绝对不能投了

	dt := models.DataTime{}
	sTime := time.Now().Add(time.Second * time.Duration(delaySecond)).Format("15:04:05") //数据库检索时间

	err = models.Db.Model(&dt).Where("type=? and action_time>?", t, sTime).Order("action_time").Limit(1).Select()
	if err == nil && dt.Type >= 0 {
		tmpCurrent_period, _ := strconv.Atoi(time.Now().Format("060102"))
		tmpCurrent_period = tmpCurrent_period * 1000
		current_period = tmpCurrent_period + dt.ActionNo
		//fmt.Println(current_period, "ww		", dt.ActionNo, "	", dt.ActionTime, "	day:", time.Now(), "	")
	} else {
		result = models.Result{Code: 590, Message: "系统错误", Data: nil}
		return
	}
	var timeleft int64
	var ttActionTime time.Time
	ttActionTime, err = time.ParseInLocation("2006-01-02 15:04:05", time.Now().Format("2006-01-02")+" "+dt.ActionTime, time.Local)
	if err != nil {
		timeleft = 100000000
	}
	timeleft = ttActionTime.Unix() - time.Now().Local().Unix()
	//fmt.Println(":::time::", ttActionTime.Unix()-time.Now().Local().Unix(), "	", time.Now().Local().Unix(), "	", time.Now().Sub(ttActionTime).String())
	timeleft = timeleft - 10
	tmp3Num := common.FindNum(current_period, 1) + common.FindNum(current_period, 2)*10 + common.FindNum(current_period, 3)*100
	if last_period != 0 && last_period+1 >= current_period && tmp3Num >= 1 { //防止出现1700824000 适用重庆时时彩
		out := (models.OpenInfo{Last_period: last_period, Last_open: d.Data, Current_period: last_period + 1, Current_period_status: "截止", Timeleft: timeleft, Type: t})
		result = models.Result{Code: 200, Message: "ok", Data: &out}
		//fmt.Println(out)
		return
	}
	var Last_open string
	d = OpenData(t, 0, 1, current_period-1)
	if d == nil { //
		//fmt.Println(result.Message, current_period-1)
		Last_open = ""
	} else {
		Last_open = d.Data
	}
	out := (models.OpenInfo{Last_period: current_period - 1, Last_open: Last_open, Current_period: current_period, Current_period_status: "截止", Timeleft: timeleft, Type: t})
	result = models.Result{Code: 200, Message: "ok", Data: &out}
	//fmt.Println("22:", out)

	return
}
