package controllers

import (
	"cp33/models"
	"math"
	"regexp"
	"strings"
	//	"encoding/json"
	"cp33/common"
	"cp33/services/lotto"
	"cp33/services/pingtais"
	"cp33/services/user"
	"fmt"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/kataras/iris"
)

// 交集
func arrIntersect(a, b []string) (count int) { //传字符串
	for i := 0; i < len(b); i++ {
		temp := b[i]
		for j := 0; j < len(a); j++ {
			if temp == a[j] {
				count += 1
				break
			}
		}
	}
	return
}

func getCount122(tempBetCodeSplit []string) (count int) { //任2循环所有注数 如|0&1&6||7&8&9|4有15注
	count = 0
	for i := 0; i < len(tempBetCodeSplit)-1; i++ {
		if tempBetCodeSplit[i] == "" {
			continue
		}
		tempStrSumCount0 := regexp.MustCompile(`[0-9]+`).FindAllString(tempBetCodeSplit[i], -1)
		for ii := i + 1; ii < len(tempBetCodeSplit); ii++ {
			if tempBetCodeSplit[ii] == "" {
				continue
			}
			tempStrSumCount1 := regexp.MustCompile(`[0-9]+`).FindAllString(tempBetCodeSplit[ii], -1)
			for j := 0; j < len(tempStrSumCount0); j++ {
				for k := 0; k < len(tempStrSumCount1); k++ {
					count += 1
				}
			}
		}

	}
	return
}

func getCountCombArr(tempBetCodeSplit []string, combArr map[int]interface{}) (count int) {
	count = 0
	for i := 0; i < len(combArr); i++ {
		tmpCount := 1
		for j := 0; j < len(combArr[i].([]int)); j++ {
			if tempBetCodeSplit[combArr[i].([]int)[j]] == "" {
				tmpCount = 0
				break
			}
			betCodeArr := regexp.MustCompile(`[0-9]+`).FindAllString(tempBetCodeSplit[combArr[i].([]int)[j]], -1)
			//fmt.Println(i, "	", j, "	", combArr[i].([]int)[j], "		", tempBetCodeSplit[combArr[i].([]int)[j]], "	", betCodeArr)
			if len(betCodeArr) >= 1 {
				tmpCount *= len(betCodeArr)
			}
		}
		count += tmpCount
	}
	return
}

func combination(c, b int) int {
	var f64 float64
	if b == 0 || c == 0 {
		return 1
	}
	if b > c {
		return 0
	}
	if b > c/2 {
		b = c - b
	}
	var a float64 = 0
	for i := c; i >= (c - b + 1); i-- {
		f64, _ = strconv.ParseFloat(strconv.Itoa(i), 64)
		a += math.Log(f64)
	}
	for i := b; i >= 1; i-- {
		f64, _ = strconv.ParseFloat(strconv.Itoa(i), 64)
		a -= math.Log(f64)
	}
	a = math.Exp(a)

	s := fmt.Sprintf("%.0f", a)
	ii, _ := strconv.Atoi(s)
	return ii
}

func getDxdsCount(betCode string, arrayLenght int) int { //大小单双
	tempBetCodeSplit := strings.Split(betCode, "|")
	arrayCount := make([][]string, arrayLenght)
	for iCount := 0; iCount < arrayLenght; iCount++ {
		arrayCount[iCount] = regexp.MustCompile(`(大|小|单|双){1}`).FindAllString(tempBetCodeSplit[iCount], -1)
	}
	count := 1
	for iCount := 0; iCount < arrayLenght; iCount++ {
		count = len(arrayCount[iCount]) * count
	}

	return count
}

func getNumCount(betCode string, arrayLenght int) int {
	tempBetCodeSplit := strings.Split(betCode, "|")
	arrayCount := make([][]string, arrayLenght)
	for iCount := 0; iCount < arrayLenght; iCount++ {
		arrayCount[iCount] = regexp.MustCompile(`[0-9]{1}`).FindAllString(tempBetCodeSplit[iCount], -1)
	}
	count := 1
	for iCount := 0; iCount < arrayLenght; iCount++ {
		count = len(arrayCount[iCount]) * count
	}
	return count
}

func PostBet(ctx iris.Context) {
	b := Base{ctx}
	if b.CheckIsLogin() == false {
		ctx.JSON(models.Result{Code: 503, Message: "未登陆！", Data: nil})
		return
	}

	var postBet models.PostBet
	err := ctx.ReadForm(&postBet)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	timeStart := time.Now()
	var result models.Result
	bets := []models.Bets{}
	var intPlayId, intSubId, intBetCount int
	var f64BetMoney, f64BetEachMoney, f64BetPrize, f64BetReward, tmpF64BetCount, sumBetAmount float64

	var tempStrSumCount []string
	if postBet.BetMore > 100 {
		result = models.Result{Code: 501, Message: "最大追100期", Data: nil}
		ctx.JSON(&result)
		return
	}

	//验证期号可否购买
	var rOpenInfo models.Result
	_, rOpenInfo = servicesLotto.OpenInfo(postBet.GameId)
	if rOpenInfo.Code != 200 || rOpenInfo.Data == nil || rOpenInfo.Data.(*models.OpenInfo).Current_period != postBet.GamePeriod {
		fmt.Println(rOpenInfo.Data.(*models.OpenInfo).Current_period, "	", postBet.GamePeriod)
		result = models.Result{Code: 588, Message: "当前期数已经关盘", Data: nil}
		ctx.JSON(&result)
		return
	}

	//取platformId通过platform 在redis或db上
	var platformId int
	tmpStrPlatformId := common.RedisClient.HGet(ctx.GetCookie("platform")+"_"+ctx.GetCookie("username"), "platformid").Val()
	platformId, err = strconv.Atoi(tmpStrPlatformId)
	if err != nil {
		fmt.Println(err.Error(), "	get platformId via db")
		platformId = servicesPingtais.GetPlatformId(ctx.GetCookie("platform"))
	}

	//取用户uid
	var uid int
	if rCmd := common.RedisClient.HGet(ctx.GetCookie("platform")+"_"+ctx.GetCookie("username"), "uid"); rCmd.Err() != nil {
		uid = services.GetUid(ctx.GetCookie("platform"), ctx.GetCookie("username"))
	} else {
		uid, err = strconv.Atoi(rCmd.Val())
		if err != nil {
			result = models.Result{Code: 555, Message: "错误！", Data: nil}
			ctx.JSON(&result)
			return
		}
	}

	if !(postBet.BetWinStop == 1 || postBet.BetWinStop == 0) {
		result = models.Result{Code: 555, Message: "提交数据错误！", Data: nil}
		ctx.JSON(&result)
		return
	}

	etime, _ := time.ParseInLocation("2006-01-02 15:04:05", "1987-02-14 09:30:00", time.Local)
	ctime, _ := time.ParseInLocation("2006-01-02 15:04:05", time.Now().Format("2006-01-02 15:04:05"), time.Local)

	tmpUuid := uuid.Must(uuid.NewRandom())
	for i := 0; i < len(postBet.Bet_list); i++ {
		intPlayId, err = strconv.Atoi(postBet.Bet_list[i]["playId"])
		if err != nil {
			result = models.Result{Code: 501, Message: err.Error(), Data: nil}
			ctx.JSON(&result)
			return
		}
		intSubId, err = strconv.Atoi(postBet.Bet_list[i]["subId"])
		if err != nil {
			result = models.Result{Code: 501, Message: err.Error(), Data: nil}
			ctx.JSON(&result)
			return
		}
		intBetCount, err = strconv.Atoi(postBet.Bet_list[i]["betCount"])
		if err != nil || intBetCount == 0 {
			result = models.Result{Code: 601, Message: err.Error(), Data: nil}
			ctx.JSON(&result)
			return
		}
		f64BetReward, err = strconv.ParseFloat(postBet.Bet_list[i]["betReward"], 3)
		if err != nil {
			result = models.Result{Code: 601, Message: err.Error(), Data: nil}
			ctx.JSON(&result)
			return
		}

		f64BetMoney, err = strconv.ParseFloat(postBet.Bet_list[i]["betMoney"], 3)
		if err != nil {
			result = models.Result{Code: 601, Message: err.Error(), Data: nil}
			ctx.JSON(&result)
			return
		}
		f64BetEachMoney, err = strconv.ParseFloat(postBet.Bet_list[i]["betEachMoney"], 3)
		if err != nil || f64BetEachMoney <= 0 {
			result = models.Result{Code: 601, Message: err.Error(), Data: nil}
			ctx.JSON(&result)
			return
		}

		var lottery models.Lottery
		err, lottery = servicesLotto.GetLotteryViaGameId(postBet.GameId)
		if !(err == nil && lottery.Id > 0 && lottery.Enable == true && lottery.IsDelete == false) {
			result = models.Result{Code: 601, Message: "这个彩票没有或暂停销售！！", Data: nil}
			ctx.JSON(&result)
			return
		}

		playedGroup := servicesLotto.PlayedGroup(intPlayId)

		played := servicesLotto.Played(platformId, intPlayId, intSubId)
		//对提交上来带有|的赔率 返点验证
		var betPrizeDb float64
		tempBetPrizeSplit := strings.Split(postBet.Bet_list[i]["betPrize"], "|")
		tmpF64BetPrizeArray := make([]float64, 5)
		switch {
		case (intPlayId == 11 && intSubId == 102) || (intPlayId == 9 && intSubId == 68): //对应数据库played表 group_id
			tempBetCodeSplit := strings.Split(postBet.Bet_list[i]["betCode"], "&")
			if len(tempBetPrizeSplit) != len(tempBetCodeSplit) {
				result = models.Result{Code: 607, Message: "提交数据错误", Data: nil}
				ctx.JSON(&result)
				return
			}
			tmpF64BetPrizeDBArray := make([]float64, 5)
			tempBetPrizeDbSplit := strings.Split(played.BonusProp, "|")
			for i := 0; i < len(tempBetPrizeSplit); i++ {
				tmpF64BetPrizeDBArray[i], err = strconv.ParseFloat(tempBetPrizeDbSplit[i], 3)
				if err != nil {
					result = models.Result{Code: 601, Message: err.Error(), Data: nil}
					ctx.JSON(&result)
					return
				}
				tmpF64BetPrizeArray[i], err = strconv.ParseFloat(tempBetPrizeSplit[i], 3)
				if err != nil {
					result = models.Result{Code: 601, Message: err.Error(), Data: nil}
					ctx.JSON(&result)
					return
				}

				switch tempBetCodeSplit[i] {
				case "豹子":
					fmt.Println("豹子")
					fmt.Println(tmpF64BetPrizeDBArray[0], "		", tmpF64BetPrizeArray[0], "		", tmpF64BetPrizeDBArray[0]*f64BetEachMoney*f64BetReward)
					fmt.Println(tmpF64BetPrizeDBArray[0]*f64BetEachMoney, "			", tmpF64BetPrizeArray[0]*f64BetEachMoney+tmpF64BetPrizeDBArray[0]*f64BetEachMoney*f64BetReward)
					if tmpF64BetPrizeDBArray[0]*f64BetEachMoney < tmpF64BetPrizeArray[0]*f64BetEachMoney+tmpF64BetPrizeDBArray[0]*f64BetEachMoney*f64BetReward {
						result = models.Result{Code: 561, Message: "提交数据错误!", Data: nil}
						ctx.JSON(&result)
						return
					}
				case "顺子":
					fmt.Println("顺子")
					if tmpF64BetPrizeDBArray[1]*f64BetEachMoney < tmpF64BetPrizeArray[1]*f64BetEachMoney+tmpF64BetPrizeDBArray[1]*f64BetEachMoney*f64BetReward {
						result = models.Result{Code: 562, Message: "提交数据错误!", Data: nil}
						ctx.JSON(&result)
						return
					}
				case "对子":
					fmt.Println("对子")
					if tmpF64BetPrizeDBArray[2]*f64BetEachMoney < tmpF64BetPrizeArray[2]*f64BetEachMoney+tmpF64BetPrizeDBArray[2]*f64BetEachMoney*f64BetReward {
						result = models.Result{Code: 563, Message: "提交数据错误!", Data: nil}
						ctx.JSON(&result)
						return
					}
				}
			}
			break

		case len(tempBetPrizeSplit) > 1:
			tmpF64BetPrizeDBArray := make([]float64, 5)
			tempBetPrizeDbSplit := strings.Split(played.BonusProp, "|")
			for i := 0; i < len(tempBetPrizeSplit); i++ {
				tmpF64BetPrizeArray[i], err = strconv.ParseFloat(tempBetPrizeSplit[i], 3)
				if err != nil {
					result = models.Result{Code: 601, Message: err.Error(), Data: nil}
					ctx.JSON(&result)
					return
				}
				tmpF64BetPrizeDBArray[i], err = strconv.ParseFloat(tempBetPrizeDbSplit[i], 3)
				if err != nil {
					result = models.Result{Code: 601, Message: err.Error(), Data: nil}
					ctx.JSON(&result)
					return
				}
				if tmpF64BetPrizeDBArray[i]*f64BetEachMoney < tmpF64BetPrizeArray[i]*f64BetEachMoney+tmpF64BetPrizeDBArray[i]*f64BetEachMoney*f64BetReward {
					result = models.Result{Code: 560, Message: "提交数据错误!", Data: nil}
					ctx.JSON(&result)
					return
				}
			}
			break

		case len(tempBetPrizeSplit) < 1:
			betPrizeDb, err = strconv.ParseFloat(played.BonusProp, 3)
			if err != nil {
				result = models.Result{Code: 601, Message: err.Error(), Data: nil}
				ctx.JSON(&result)
				return
			}
			f64BetPrize, err = strconv.ParseFloat(postBet.Bet_list[i]["betPrize"], 3)
			if err != nil {
				result = models.Result{Code: 601, Message: err.Error(), Data: nil}
				ctx.JSON(&result)
				return
			}
			break
		}

		//处理追期问题 验证提交的投注号码、注数、单价、总价 有无恶意修改
		tmpF64BetCount, _ = strconv.ParseFloat(strconv.Itoa(intBetCount), 3) //post上来的下注数
		var tempCount int                                                    //统计投注号码得到的总注数
		switch intPlayId {                                                   //intPlayId为玩法组
		case 1, 7, 8, 11, 9, 12, 4, 2, 13, 14: //定位胆,五星,四星,后三,前三,前二,不定位,大小单双,任二,任三
			switch intSubId {
			case 37, 101, 67, 113, 115: //定位胆 1, 后三、前三和值尾数 11、9,前三、后三一码不定位4
				tempStrSumCount = regexp.MustCompile(`[0-9]{1}`).FindAllString(postBet.Bet_list[i]["betCode"], -1)
				tempCount = len(tempStrSumCount)
			case 107: //5星直选复式 7
				arrayLenght := 5
				tempCount = getNumCount(postBet.Bet_list[i]["betCode"], arrayLenght)
			case 105: //4星直选复式 8
				arrayLenght := 4
				tempCount = getNumCount(postBet.Bet_list[i]["betCode"], arrayLenght)
			case 88, 54: //后三直选复式 11 ,前三 直选复式9
				arrayLenght := 3
				tempCount = getNumCount(postBet.Bet_list[i]["betCode"], arrayLenght)
			case 90, 56: //后三直选和值 11,前三 直选和值9
				tempStrSumCount = regexp.MustCompile(`[0-9]+`).FindAllString(postBet.Bet_list[i]["betCode"], -1)
				for i := 0; i < len(tempStrSumCount); i++ {
					tempCount += models.Sum_90_56[tempStrSumCount[i]]
				}
			case 91, 57: //后三直选跨度 11,前三直选跨度9
				tempStrSumCount = regexp.MustCompile(`[0-9]+`).FindAllString(postBet.Bet_list[i]["betCode"], -1)
				for i := 0; i < len(tempStrSumCount); i++ {
					tempCount += models.Skip91_57[tempStrSumCount[i]]
				}
			case 92, 58: //后三组合11,前三组合9
				arrayLenght := 3
				tempCount = getNumCount(postBet.Bet_list[i]["betCode"], arrayLenght)
				tempBetCodeSplit := strings.Split(postBet.Bet_list[i]["betCode"], "|")
				tempStrSumCount := make([][]string, 3)
				for i := 0; i < len(tempBetCodeSplit); i++ {
					tempStrSumCount[i] = regexp.MustCompile(`[0-9]{1}`).FindAllString(tempBetCodeSplit[i], -1)
				}
				tempCount2 := len(tempStrSumCount[1]) * len(tempStrSumCount[2])
				tempCount = tempCount + tempCount2 + len(tempStrSumCount[2])
			case 93, 59: //后三、前三组三复式11、9
				tempStrSumCount = regexp.MustCompile(`[0-9]{1}`).FindAllString(postBet.Bet_list[i]["betCode"], -1)
				tempCount = len(tempStrSumCount) * (len(tempStrSumCount) - 1)
			case 94, 60, 121: //后三、前三组六复式 11、9,五星三码4
				tempStrSumCount = regexp.MustCompile(`[0-9]{1}`).FindAllString(postBet.Bet_list[i]["betCode"], -1)
				tempCount = combination(len(tempStrSumCount), 3)
			case 97, 63: //后三、前三组选和值11、9
				tempStrSumCount = regexp.MustCompile(`[0-9]+`).FindAllString(postBet.Bet_list[i]["betCode"], -1)
				for i := 0; i < len(tempStrSumCount); i++ {
					tempCount += models.Sum_97_63[tempStrSumCount[i]]
				}
			case 99, 65: //后三、前三组选包胆11、9   只能选一个号码
				tempStrSumCount = regexp.MustCompile(`[0-9]+`).FindAllString(postBet.Bet_list[i]["betCode"], -1)
				tempCount = 54 * len(tempStrSumCount)
			case 102, 68, 117, 244, 119: //后三、前三特殊号11、9,不定位前四一码、后四一码、五星一码4
				tempStrSumCount = strings.Split(postBet.Bet_list[i]["betCode"], "&")
				tempCount = len(tempStrSumCount)
			case 38:
				arrayLenght := 2
				tempCount = getNumCount(postBet.Bet_list[i]["betCode"], arrayLenght)
			case 40:
				tempStrSumCount = regexp.MustCompile(`[0-9]+`).FindAllString(postBet.Bet_list[i]["betCode"], -1)
				for i := 0; i < len(tempStrSumCount); i++ {
					tempCount += models.Sum_40[tempStrSumCount[i]]
				}
			case 41:
				tempStrSumCount = regexp.MustCompile(`[0-9]+`).FindAllString(postBet.Bet_list[i]["betCode"], -1)
				for i := 0; i < len(tempStrSumCount); i++ {
					tempCount += models.Skip41[tempStrSumCount[i]]
				}
			case 46, 114, 116, 118, 245, 123, 125: //前二组选复试12,不定位前三、后三二码、前四二码、后四二码、五星二码 4,任二组选复试13,任三组三复试
				tempStrSumCount = regexp.MustCompile(`[0-9]{1}`).FindAllString(postBet.Bet_list[i]["betCode"], -1)
				tempCount = combination(len(tempStrSumCount), 2)
			case 48: //前二组选和值12
				tempStrSumCount = regexp.MustCompile(`[0-9]+`).FindAllString(postBet.Bet_list[i]["betCode"], -1)
				for i := 0; i < len(tempStrSumCount); i++ {
					tempCount += models.Sum48[tempStrSumCount[i]]
				}
			case 49: //组选包胆12
				tempStrSumCount = regexp.MustCompile(`[0-9]{1}`).FindAllString(postBet.Bet_list[i]["betCode"], -1)
				tempCount = 9 * len(tempStrSumCount)
			case 111, 109: //前二、后二大小单双2
				tempCount = getDxdsCount(postBet.Bet_list[i]["betCode"], 2)
			case 112, 110: //前三、后三大小单双
				tempCount = getDxdsCount(postBet.Bet_list[i]["betCode"], 3)
			case 122: //任二直选复式13
				tempBetCodeSplit := strings.Split(postBet.Bet_list[i]["betCode"], "|")
				tempCount = getCount122(tempBetCodeSplit)
			case 128: //任三直选复式14
				tempBetCodeSplit := strings.Split(postBet.Bet_list[i]["betCode"], "|")
				tempCount = getCountCombArr(tempBetCodeSplit, models.CombArr128)
			case 124: //任二直选和值13
				tempStrSumCount = regexp.MustCompile(`[0-9]+`).FindAllString(postBet.Bet_list[i]["betCode"], -1)
				for i := 0; i < len(tempStrSumCount); i++ {
					tempCount += models.Sum124[tempStrSumCount[i]]
				}
				tempBetPosSplit := strings.Split(postBet.Bet_list[i]["betPos"], "|")
				switch len(tempBetPosSplit) {
				case 2:
					break
				case 3:
					tempCount = tempCount * 3
				case 4:
					tempCount = tempCount * 6
				case 5:
					tempCount = tempCount * 10
				default:
					return
				}
			case 127: //任二组选和值14
				tempStrSumCount = regexp.MustCompile(`[0-9]+`).FindAllString(postBet.Bet_list[i]["betCode"], -1)
				for i := 0; i < len(tempStrSumCount); i++ {
					tempCount += models.Sum127[tempStrSumCount[i]]
				}
				tempBetPosSplit := strings.Split(postBet.Bet_list[i]["betPos"], "|")
				switch len(tempBetPosSplit) {
				case 2:
					break
				case 3:
					tempCount = tempCount * 3
				case 4:
					tempCount = tempCount * 6
				case 5:
					tempCount = tempCount * 10
				default:
					return
				}
			case 130: //任3直选和值14
				tempStrSumCount = regexp.MustCompile(`[0-9]+`).FindAllString(postBet.Bet_list[i]["betCode"], -1)
				for i := 0; i < len(tempStrSumCount); i++ {
					tempCount += models.Sum130[tempStrSumCount[i]]
				}
				tempBetPosSplit := strings.Split(postBet.Bet_list[i]["betPos"], "|")
				switch len(tempBetPosSplit) {
				case 3:
					break
				case 4:
					tempCount = tempCount * 4
				case 5:
					tempCount = tempCount * 10
				default:
					return
				}
			case 131: //任三组三复试
				tempStrSumCount = regexp.MustCompile(`[0-9]{1}`).FindAllString(postBet.Bet_list[i]["betCode"], -1)
				tempCount = combination(len(tempStrSumCount), 2) * 2
				tempBetPosSplit := strings.Split(postBet.Bet_list[i]["betPos"], "|")
				switch len(tempBetPosSplit) {
				case 3:
					break
				case 4:
					tempCount = tempCount * 4
				case 5:
					tempCount = tempCount * 10
				default:
					return
				}
			case 133: //任三组六复试
				tempStrSumCount = regexp.MustCompile(`[0-9]{1}`).FindAllString(postBet.Bet_list[i]["betCode"], -1)
				tempCount = combination(len(tempStrSumCount), 3)
				tempBetPosSplit := strings.Split(postBet.Bet_list[i]["betPos"], "|")
				switch len(tempBetPosSplit) {
				case 3:
					break
				case 4:
					tempCount = tempCount * 4
				case 5:
					tempCount = tempCount * 10
				default:
					return
				}
			case 137: //任三组选和值
				tempStrSumCount = regexp.MustCompile(`[0-9]+`).FindAllString(postBet.Bet_list[i]["betCode"], -1)
				for i := 0; i < len(tempStrSumCount); i++ {
					tempCount += models.Sum137[tempStrSumCount[i]]
				}
				tempBetPosSplit := strings.Split(postBet.Bet_list[i]["betPos"], "|")
				switch len(tempBetPosSplit) {
				case 3:
					break
				case 4:
					tempCount = tempCount * 4
				case 5:
					tempCount = tempCount * 10
				default:
					return
				}
			}
		case 15: //任四
			switch intSubId {
			case 139: //直选复式
				tempBetCodeSplit := strings.Split(postBet.Bet_list[i]["betCode"], "|")
				tempCount = getCountCombArr(tempBetCodeSplit, models.CombArr139)
			case 141: //任四组选24
				tempStrSumCount = regexp.MustCompile(`[0-9]{1}`).FindAllString(postBet.Bet_list[i]["betCode"], -1)
				tempCount = combination(len(tempStrSumCount), 4)
				tempBetPosSplit := strings.Split(postBet.Bet_list[i]["betPos"], "|")
				switch len(tempBetPosSplit) {
				case 4:
					break
				case 5:
					tempCount = tempCount * 5
				default:
					return
				}
			case 142, 144: //任四组选12,任四组选4 如6&7&8&9|2&7&8 8注
				tempBetCodeSplit := strings.Split(postBet.Bet_list[i]["betCode"], "|")
				if len(tempBetCodeSplit) != 2 {
					return
				}
				need := 2
				if intSubId == 144 {
					need = 1
				}
				tempStrCountLeft := regexp.MustCompile(`[0-9]{1}`).FindAllString(tempBetCodeSplit[0], -1)
				tempStrCountRight := regexp.MustCompile(`[0-9]{1}`).FindAllString(tempBetCodeSplit[1], -1)
				h := arrIntersect(tempStrCountLeft, tempStrCountRight) //交集个数
				tmpNums := combination(len(tempStrCountLeft), 1) * combination(len(tempStrCountRight), need)
				if h > 0 { //交集个数
					if intSubId == 142 {
						tmpNums -= combination(h, 1) * combination(len(tempStrCountRight)-1, 1)
					} else if intSubId == 144 { //C(m,1)*C(n,1)-C(h,1)
						tmpNums -= combination(h, 1)
					}
				}
				tempCount += tmpNums
				//fmt.Println(tempCount, "	", tempStrCountLeft, "	", tempStrCountRight)
				tempBetPosSplit := strings.Split(postBet.Bet_list[i]["betPos"], "|")
				switch len(tempBetPosSplit) {
				case 4:
					break
				case 5:
					tempCount = tempCount * 5
				default:
					return
				}
			case 143: //任四组选6
				tempStrSumCount = regexp.MustCompile(`[0-9]{1}`).FindAllString(postBet.Bet_list[i]["betCode"], -1)
				tempCount = combination(len(tempStrSumCount), 2)
				tempBetPosSplit := strings.Split(postBet.Bet_list[i]["betPos"], "|")
				switch len(tempBetPosSplit) {
				case 4:
					break
				case 5:
					tempCount = tempCount * 5
				default:
					return
				}
			}
		}

		//fmt.Println(tempCount, "	", intBetCount, "	tmpF64BetCount=", tmpF64BetCount, " f64BetEachMoney=", f64BetEachMoney, "	", common.Round(f64BetEachMoney*tmpF64BetCount), "	", f64BetMoney)
		if intBetCount != tempCount || common.Round(f64BetEachMoney*tmpF64BetCount) != f64BetMoney {
			ctx.JSON(models.Result{Code: 202, Message: "下注错误!", Data: nil})
			return
		}
		sumBetAmount += f64BetMoney //统计总价循环完验证

		//检查投注赔率f64BetPrize及返点f64BetReward是否符合
		//检查platformId PlayId、SubId、SubName是否存在并且开启
		if played == nil || played.Enable == false || played.SubName != postBet.Bet_list[i]["subName"] {
			result = models.Result{Code: 555, Message: "这个彩票没有或暂停销售！", Data: nil}
			ctx.JSON(&result)
			return
		} else if len(tempBetPrizeSplit) == 0 && betPrizeDb*f64BetEachMoney < f64BetPrize*f64BetEachMoney+betPrizeDb*f64BetEachMoney*f64BetReward {
			result = models.Result{Code: 559, Message: "提交数据错误!", Data: nil}
			ctx.JSON(&result)
			return
		}

		bet := models.Bets{
			PlatformId:   platformId,
			Uid:          uid,
			GameName:     lottery.Name,
			GameId:       postBet.GameId,
			GamePeriod:   postBet.GamePeriod,
			BetNext:      postBet.BetNext,
			Amount:       postBet.Amount,
			BetMore:      postBet.BetMore,
			BetWinStop:   postBet.BetWinStop,
			Label:        tmpUuid, //用于取消追号的识别码
			Ctime:        ctime,
			Etime:        etime,
			IsWin:        false,
			WinAmount:    0.000,
			OpenNum:      "",
			Status:       0,
			PlayId:       intPlayId, //对应数据库played表 group_id
			GroupName:    playedGroup.GroupName,
			SubId:        intSubId,
			SubName:      postBet.Bet_list[i]["subName"],
			BetCode:      postBet.Bet_list[i]["betCode"],
			BetCount:     intBetCount,
			BetMoney:     f64BetMoney,
			BetEachMoney: f64BetEachMoney,
			BetPrize:     postBet.Bet_list[i]["betPrize"],
			BetPrizeShow: postBet.Bet_list[i]["betPrizeShow"],
			BetReward:    f64BetReward,
			BetPos:       postBet.Bet_list[i]["betPos"],
		}
		bets = append(bets, bet)
	}

	if sumBetAmount != postBet.Amount { //验证单期总金额
		ctx.JSON(models.Result{Code: 208, Message: "下注错误!", Data: nil})
		return
	}

	var betsArray []models.Bets
	staticGamePeriod := bets[0].GamePeriod
	var tmpGamePeriod int

	for more := 0; more < bets[0].BetMore; more++ {
		//fmt.Println(bets[0].GamePeriod)
		tmpGamePeriod = common.BetMore(bets[0].GameId, staticGamePeriod, more)

		for i := 0; i < len(bets); i++ {
			bets[i].GamePeriod = tmpGamePeriod
			betsArray = append(betsArray, bets[i])
			//fmt.Println(tmpGamePeriod, "	", bets[i].GamePeriod)
		}

	}

	result = servicesLotto.DoBets(betsArray, uid, ctx.RemoteAddr())
	ctx.JSON(&result)
	fmt.Println("postBet ok ,speed time:", time.Now().Sub(timeStart))

}
