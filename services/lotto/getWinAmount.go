package servicesLotto

import (
	"cp33/common"
	//	"cp33/models"
	"fmt"
	"regexp"
	"sort"
	"strconv"
	"strings"
)

func (endBets *endBets) dingWeiDan37(i *int, dbBetPrize *float64) {
	var intBetCount int //中奖注数
	tmpBetCodeSplit := strings.Split((*endBets.bets)[*i].BetCode, "|")
	for j := 0; len(tmpBetCodeSplit) == len(endBets.dataSplit) && j < len(tmpBetCodeSplit); j++ {
		tmpBetCodeOne := regexp.MustCompile(`([0-9]+)`).FindAllString(tmpBetCodeSplit[j], '&')
		for ii := 0; ii < len(tmpBetCodeOne); ii++ {
			if tmpBetCodeOne[ii] == endBets.dataSplit[j] {
				intBetCount = intBetCount + 1
				break
			}
		}
	}
	(*endBets.bets)[*i].WinAmount = common.Round(float64(intBetCount) * (*dbBetPrize) * (*endBets.bets)[*i].BetEachMoney)
}

func (endBets *endBets) zhiXuanFuShi(i *int, dbBetPrize *float64, start, end int) {
	tempBetCodeSplit := strings.Split((*endBets.bets)[*i].BetCode, "|")
	arrayCount := make([][]string, end)
	for k := start; k < end; k++ {
		arrayCount[k-start] = regexp.MustCompile(`[0-9]{1}`).FindAllString(tempBetCodeSplit[k-start], -1)
		for j := 0; j < len(arrayCount[k-start]); j++ {
			if endBets.dataSplit[k] == arrayCount[k-start][j] {
				if k == end-1 { //中了
					(*endBets.bets)[*i].WinAmount += common.Round(*dbBetPrize * (*endBets.bets)[*i].BetEachMoney)
					return
				}
				break
			} else if j+1 == len(arrayCount[k-start]) { //miss
				return
			}
		}
	}
}

func (endBets *endBets) zhiXuanHeZhi(i *int, dbBetPrize *float64, start, end int) {
	var intSum int
	dataSplit := make([]int, end-start)
	arrayCount := regexp.MustCompile(`[0-9]+`).FindAllString((*endBets.bets)[*i].BetCode, -1)
	for j := start; j < end; j++ {
		dataSplit[j-start], _ = strconv.Atoi(endBets.dataSplit[j])
		intSum = intSum + dataSplit[j-start]
	}
	strSum := strconv.Itoa(intSum)
	for k := 0; k < len(arrayCount); k++ {
		if arrayCount[k] == strSum {
			(*endBets.bets)[*i].WinAmount += common.Round(*dbBetPrize * (*endBets.bets)[*i].BetEachMoney)
			return
		}

	}
}

func (endBets *endBets) zhiXuanKuaDu(i *int, dbBetPrize *float64, start, end int) {
	dataSplit := make([]int, end-start)
	arrayCount := regexp.MustCompile(`[0-9]{1}`).FindAllString((*endBets.bets)[*i].BetCode, -1)
	for j := start; j < end; j++ {
		dataSplit[j-start], _ = strconv.Atoi(endBets.dataSplit[j])
	}
	sort.Ints(dataSplit)
	strSkipNum := strconv.Itoa(dataSplit[len(dataSplit)-1] - dataSplit[0])
	for k := 0; k < len(arrayCount); k++ {
		if strSkipNum == arrayCount[k] {
			(*endBets.bets)[*i].WinAmount = common.Round(*dbBetPrize * (*endBets.bets)[*i].BetEachMoney)
			return
		}
	}
	//fmt.Println("strSkipNum", strSkipNum, "	", *dbBetPrize, "*", (*endBets.bets)[*i].BetEachMoney, "*", float64(intCount))
}

func (endBets *endBets) houSanZuSanFuShi(i *int, dbBetPrize *float64, start, end int) {
	dataSplit := make([]int, end-start)
	arrayBetCode := regexp.MustCompile(`[0-9]{1}`).FindAllString((*endBets.bets)[*i].BetCode, -1)
	for j := start; j < end; j++ {
		dataSplit[j-start], _ = strconv.Atoi(endBets.dataSplit[j])
	}

	for j := 0; j < len(dataSplit); j++ {
		strDataSplit := strconv.Itoa(dataSplit[j])
		for k := 0; k < len(arrayBetCode); k++ {
			if arrayBetCode[k] == strDataSplit {
				if j == len(dataSplit)-1 { //中了
					(*endBets.bets)[*i].WinAmount += common.Round(*dbBetPrize * (*endBets.bets)[*i].BetEachMoney)
					return
				}
				break
			} else if k == len(arrayBetCode)-1 { //miss
				return
			}
		}
	}
}

//2&4&6&7&8&9  093
func (endBets *endBets) zuXuanBaoDan3(i *int, dbBetPrizeSplit *[]float64, start, end int) {
	if endBets.dataSplit[start] == endBets.dataSplit[start+1] && endBets.dataSplit[start+1] == endBets.dataSplit[start+2] { //三个一样的跳过
		return
	}
	arrayBetCode := regexp.MustCompile(`[0-9]{1}`).FindAllString((*endBets.bets)[*i].BetCode, -1)
	for j := 0; j < len(arrayBetCode); j++ {
		match := 0
		for k := start; k < end; k++ {
			if endBets.dataSplit[k] == arrayBetCode[j] { //中了
				match = match + 1
			}
			if k == end-1 {
				switch match {
				case 1:
					(*endBets.bets)[*i].WinAmount += common.Round((*dbBetPrizeSplit)[1] * (*endBets.bets)[*i].BetEachMoney)
				case 2:
					(*endBets.bets)[*i].WinAmount += common.Round((*dbBetPrizeSplit)[0] * (*endBets.bets)[*i].BetEachMoney)
				default:
					break
				}
			}
		}
	}

}

func (endBets *endBets) zuXuanBaoDan2(i *int, dbBetPrize *float64, start, end int) {
	if endBets.dataSplit[start] == endBets.dataSplit[start+1] {
		return
	}
	arrayBetCode := regexp.MustCompile(`[0-9]{1}`).FindAllString((*endBets.bets)[*i].BetCode, -1)
	for j := 0; j < len(arrayBetCode); j++ {
		for k := start; k < end; k++ {
			if endBets.dataSplit[k] == arrayBetCode[j] { //中了
				(*endBets.bets)[*i].WinAmount += common.Round((*dbBetPrize) * (*endBets.bets)[*i].BetEachMoney)
			}
		}
	}

}

func (endBets *endBets) zuXuanFuShi(i *int, dbBetPrize *float64, start, end int) {
	dataSplit := make([]int, end-start)
	arrayBetCode := regexp.MustCompile(`[0-9]{1}`).FindAllString((*endBets.bets)[*i].BetCode, -1)
	for j := start; j < end; j++ {
		dataSplit[j-start], _ = strconv.Atoi(endBets.dataSplit[j])
	}

	for j := 0; j < len(dataSplit); j++ {
		strDataSplit := strconv.Itoa(dataSplit[j])
		for k := 0; k < len(arrayBetCode); k++ {
			if arrayBetCode[k] == strDataSplit {
				if j == len(dataSplit)-1 { //中了
					(*endBets.bets)[*i].WinAmount += common.Round(*dbBetPrize * (*endBets.bets)[*i].BetEachMoney)
				}
				break
			} else if k == len(arrayBetCode)-1 { //miss
				return
			}
		}
	}
}

func (endBets *endBets) buDingWei(i *int, dbBetPrize *float64, match, start, end int) {
	dataSplit := make([]int, end-start)
	arrayBetCode := regexp.MustCompile(`[0-9]{1}`).FindAllString((*endBets.bets)[*i].BetCode, -1)
	for j := start; j < end; j++ {
		dataSplit[j-start], _ = strconv.Atoi(endBets.dataSplit[j])
	}

	count := 0
	for j := 0; j < len(arrayBetCode); j++ { //0&1&2&3&4&5&6&7&8&9
		for k := 0; k < len(dataSplit); k++ { //9 7 1
			strDataSplit := strconv.Itoa(dataSplit[k])
			if arrayBetCode[j] == strDataSplit {
				count += 1
				break
			}
		}
	}

	if count < match { //miss
		return
	}

	(*endBets.bets)[*i].WinAmount = common.Round(*dbBetPrize * (*endBets.bets)[*i].BetEachMoney * float64(common.Combination(count, end-start)))
}

func (endBets *endBets) heZhiWeiHao(i *int, dbBetPrize *float64, start, end int) {
	var intSum int
	dataSplit := make([]int, end-start)
	arrayCount := regexp.MustCompile(`[0-9]+`).FindAllString((*endBets.bets)[*i].BetCode, -1)
	for j := start; j < end; j++ {
		dataSplit[j-start], _ = strconv.Atoi(endBets.dataSplit[j])
		intSum = intSum + dataSplit[j-start]
	}
	strNum := strconv.Itoa(common.FindNum(intSum, 1))
	for k := 0; k < len(arrayCount); k++ {
		if arrayCount[k] == strNum {
			(*endBets.bets)[*i].WinAmount += common.Round(*dbBetPrize * (*endBets.bets)[*i].BetEachMoney)
			return
		}

	}
}

//豹子&顺子&对子
func (endBets *endBets) teSuHao(i *int, dbBetPrizeSplit *[]float64, start, end int) {
	dataSplit := make([]int, end-start)
	for j := start; j < end; j++ {
		dataSplit[j-start], _ = strconv.Atoi(endBets.dataSplit[j])
	}
	arrayBets := strings.Split((*endBets.bets)[*i].BetCode, "&")
	for j := 0; j < len(arrayBets); j++ {
		switch arrayBets[j] {
		case "豹子":
			if dataSplit[0] == dataSplit[1] && dataSplit[1] == dataSplit[2] {
				(*endBets.bets)[*i].WinAmount += common.Round((*dbBetPrizeSplit)[0] * (*endBets.bets)[*i].BetEachMoney)
			}
		case "顺子":
			sort.Ints(dataSplit)
			if dataSplit[1]-dataSplit[0] == 1 && dataSplit[2]-dataSplit[1] == 1 {
				(*endBets.bets)[*i].WinAmount += common.Round((*dbBetPrizeSplit)[1] * (*endBets.bets)[*i].BetEachMoney)
			}
		case "对子":
			if dataSplit[0] == dataSplit[1] || dataSplit[1] == dataSplit[2] || dataSplit[0] == dataSplit[2] {
				(*endBets.bets)[*i].WinAmount += common.Round((*dbBetPrizeSplit)[2] * (*endBets.bets)[*i].BetEachMoney)
			}
		}
	}
}

func (endBets *endBets) daXiaoDanShuang(i *int, dbBetPrize *float64, start, end int) {
	dataSplit := make([]int, end-start)
	for j := start; j < end; j++ {
		dataSplit[j-start], _ = strconv.Atoi(endBets.dataSplit[j])
	}
	betCode := strings.Split((*endBets.bets)[*i].BetCode, "|") //大&小&单&双|大&小&单&双
	count := make(map[int]int, end-start)
	for j := 0; j < len(dataSplit); j++ {
		betCodeSplit := strings.Split(betCode[j], "&")
		for k := 0; k < len(betCodeSplit); k++ { //大&小&单&双
			switch {
			case regexp.MustCompile(`(大)`).MatchString(betCodeSplit[k]) && dataSplit[j] >= 5:
				count[j] += 1
			case regexp.MustCompile(`(小)`).MatchString(betCodeSplit[k]) && dataSplit[j] < 5:
				count[j] += 1
			case regexp.MustCompile(`(单)`).MatchString(betCodeSplit[k]) && dataSplit[j]%2 == 1:
				count[j] += 1
			case regexp.MustCompile(`(双)`).MatchString(betCodeSplit[k]) && dataSplit[j]%2 == 0:
				count[j] += 1
			}
		}
	}
	matchCount := 1
	for j := 0; j < len(count); j++ {
		matchCount *= count[j]
	}

	(*endBets.bets)[*i].WinAmount += common.Round((*dbBetPrize) * (*endBets.bets)[*i].BetEachMoney * float64(matchCount))
}

func (endBets *endBets) getWinAmount(i *int) (betRewardMoney float64) { //获取中奖金额、返点金额
	var err error
	var dbBetPrize float64
	dbBetPrizeSplit := make([]float64, 5)
	tempDbBetPrizeSplit := strings.Split((*endBets.bets)[*i].BetPrize, "|")
	switch { //特殊赔率处理
	case len(tempDbBetPrizeSplit) == 1:
		dbBetPrize, err = strconv.ParseFloat((*endBets.bets)[*i].BetPrize, 64)
		if err != nil {
			fmt.Println("services (endBets *endBets) getWinAmount:" + err.Error())
			endBets.tx.Rollback()
			return 0
		}
		break
	case len(tempDbBetPrizeSplit) > 1:
		for j := 0; j < len(tempDbBetPrizeSplit); j++ {
			dbBetPrizeSplit[j], err = strconv.ParseFloat(tempDbBetPrizeSplit[j], 64)
			if err != nil {
				fmt.Println("services (endBets *endBets) getWinAmount:" + err.Error())
				endBets.tx.Rollback()
				return 0
			}
		}
		break
	default:
		endBets.tx.Rollback()
		return
	}

	//返点
	betRewardMoney = common.Round((*endBets.bets)[*i].BetMoney * (*endBets.bets)[*i].BetReward)

	switch (*endBets.bets)[*i].PlayId {
	case 1, 7, 8, 11, 9, 12, 4, 2:
		switch (*endBets.bets)[*i].SubId {
		case 37:
			endBets.dingWeiDan37(i, &dbBetPrize)
			return
		case 107: //5星直选复式
			endBets.zhiXuanFuShi(i, &dbBetPrize, 0, 5)
			return
		case 105: //4星直选复式
			endBets.zhiXuanFuShi(i, &dbBetPrize, 1, 5)
			return
		case 38: //前2直选复式
			endBets.zhiXuanFuShi(i, &dbBetPrize, 0, 2)
			return
		case 88: //后3直选复式
			endBets.zhiXuanFuShi(i, &dbBetPrize, 2, 5)
			return
		case 54: //前3直选复式
			endBets.zhiXuanFuShi(i, &dbBetPrize, 0, 3)
			return
		case 40: //前2直选和值
			endBets.zhiXuanHeZhi(i, &dbBetPrize, 0, 2)
			return
		case 90: //后3直选和值
			endBets.zhiXuanHeZhi(i, &dbBetPrize, 2, 5)
			return
		case 56: //前3直选和值
			endBets.zhiXuanHeZhi(i, &dbBetPrize, 0, 3)
			return
		case 91: //后3直选跨度
			endBets.zhiXuanKuaDu(i, &dbBetPrize, 2, 5)
			return
		case 57: //前3直选跨度
			endBets.zhiXuanKuaDu(i, &dbBetPrize, 0, 3)
			return
		case 41: //前2直选跨度
			endBets.zhiXuanKuaDu(i, &dbBetPrize, 0, 2)
			return
		case 92: //后三组合
			endBets.zhiXuanFuShi(i, &dbBetPrizeSplit[0], 2, 5)
			endBets.zhiXuanFuShi(i, &dbBetPrizeSplit[1], 3, 5)
			endBets.zhiXuanFuShi(i, &dbBetPrizeSplit[2], 4, 5)
			return
		case 58: //前三组合
			endBets.zhiXuanFuShi(i, &dbBetPrizeSplit[0], 0, 3)
			endBets.zhiXuanFuShi(i, &dbBetPrizeSplit[1], 1, 3)
			endBets.zhiXuanFuShi(i, &dbBetPrizeSplit[2], 2, 3)
			return
		case 93, 94: //后三 组三复式，组六复式
			if endBets.dataSplit[2] == endBets.dataSplit[3] && endBets.dataSplit[3] == endBets.dataSplit[4] && endBets.dataSplit[2] == endBets.dataSplit[4] {
				return
			}
			if endBets.dataSplit[2] == endBets.dataSplit[3] || endBets.dataSplit[3] == endBets.dataSplit[4] || endBets.dataSplit[2] == endBets.dataSplit[4] {
				if (*endBets.bets)[*i].SubId == 93 {
					endBets.houSanZuSanFuShi(i, &dbBetPrize, 2, 5)
				}
				return
			} else if (*endBets.bets)[*i].SubId == 94 {
				endBets.houSanZuSanFuShi(i, &dbBetPrize, 2, 5)
			}
			return
		case 59, 60: //前三 组三复式，组六复式
			if endBets.dataSplit[0] == endBets.dataSplit[1] && endBets.dataSplit[1] == endBets.dataSplit[2] && endBets.dataSplit[2] == endBets.dataSplit[0] {
				return
			}
			if endBets.dataSplit[0] == endBets.dataSplit[1] || endBets.dataSplit[1] == endBets.dataSplit[2] || endBets.dataSplit[2] == endBets.dataSplit[0] {
				if (*endBets.bets)[*i].SubId == 59 {
					endBets.houSanZuSanFuShi(i, &dbBetPrize, 0, 3)
					return
				}
			} else if (*endBets.bets)[*i].SubId == 60 {
				endBets.houSanZuSanFuShi(i, &dbBetPrize, 0, 3)
			}
			return
		case 46: //前2 组选复式
			if endBets.dataSplit[0] == endBets.dataSplit[1] {
				return
			}
			endBets.zuXuanFuShi(i, &dbBetPrize, 0, 2)
			return
		case 97: //后三 组选和值 ，和值3 开奖号码：后三位 003 中第一个赔率，012中第二个赔率
			if endBets.dataSplit[2] == endBets.dataSplit[3] && endBets.dataSplit[3] == endBets.dataSplit[4] && endBets.dataSplit[2] == endBets.dataSplit[4] {
				return
			}
			if endBets.dataSplit[2] == endBets.dataSplit[3] || endBets.dataSplit[3] == endBets.dataSplit[4] || endBets.dataSplit[2] == endBets.dataSplit[4] {
				endBets.zhiXuanHeZhi(i, &dbBetPrizeSplit[0], 2, 5)
			} else {
				endBets.zhiXuanHeZhi(i, &dbBetPrizeSplit[1], 2, 5)
			}
			return
		case 63: //前三 组选和值
			if endBets.dataSplit[2] == endBets.dataSplit[3] && endBets.dataSplit[3] == endBets.dataSplit[4] && endBets.dataSplit[2] == endBets.dataSplit[4] {
				return
			}
			if endBets.dataSplit[2] == endBets.dataSplit[3] || endBets.dataSplit[3] == endBets.dataSplit[4] || endBets.dataSplit[2] == endBets.dataSplit[4] {
				endBets.zhiXuanHeZhi(i, &dbBetPrizeSplit[0], 0, 3)
			} else {
				endBets.zhiXuanHeZhi(i, &dbBetPrizeSplit[1], 0, 3)
			}
			return
		case 48: //前2 组选和值
			if endBets.dataSplit[0] == endBets.dataSplit[1] {
				return
			}
			endBets.zhiXuanHeZhi(i, &dbBetPrize, 0, 2)
			return
		case 99: //后三 组选包胆 .......
			endBets.zuXuanBaoDan3(i, &dbBetPrizeSplit, 2, 5)
			return
		case 49: //前2 组选包胆 .......
			if endBets.dataSplit[0] == endBets.dataSplit[1] {
				return
			}
			endBets.zuXuanBaoDan2(i, &dbBetPrize, 0, 2)
			return
		case 65: //前三 组选包胆 .......
			endBets.zuXuanBaoDan3(i, &dbBetPrizeSplit, 0, 3)
			return
		case 101: //后三和值尾数
			endBets.heZhiWeiHao(i, &dbBetPrize, 2, 5)
			return
		case 67: //前三和值尾数
			endBets.heZhiWeiHao(i, &dbBetPrize, 0, 3)
			return
		case 102: //后三特殊号
			endBets.teSuHao(i, &dbBetPrizeSplit, 2, 5)
			return
		case 68: //前三特殊号
			endBets.teSuHao(i, &dbBetPrizeSplit, 0, 3)
			return
		case 113: //不定位 前三一码
			endBets.buDingWei(i, &dbBetPrize, 1, 0, 3)
			return
		case 114: //不定位 前三二码
			endBets.buDingWei(i, &dbBetPrize, 2, 0, 3)
			return
		case 115: //不定位后三一码
			endBets.buDingWei(i, &dbBetPrize, 1, 2, 5)
			return
		case 116: //不定位后三2码
			endBets.buDingWei(i, &dbBetPrize, 2, 2, 5)
			return
		case 117: //不定位前四一码
			endBets.buDingWei(i, &dbBetPrize, 1, 0, 4)
			return
		case 118: //不定位前四2码
			endBets.buDingWei(i, &dbBetPrize, 2, 0, 4)
			return
		case 244: //不定位后四1码
			endBets.buDingWei(i, &dbBetPrize, 1, 0, 4)
			return
		case 245: //不定位后四2码
			endBets.buDingWei(i, &dbBetPrize, 2, 0, 4)
			return
		case 119: //不定位5 1码
			endBets.buDingWei(i, &dbBetPrize, 1, 0, 5)
			return
		case 120: //不定位5 2码
			endBets.buDingWei(i, &dbBetPrize, 2, 0, 5)
			return
		case 121: //不定位5 3码
			endBets.buDingWei(i, &dbBetPrize, 3, 0, 5)
			return
		case 111: //前二大小单双
			endBets.daXiaoDanShuang(i, &dbBetPrize, 0, 2)
			return
		case 109: //后二大小单双
			endBets.daXiaoDanShuang(i, &dbBetPrize, 3, 5)
			return
		case 112: //前三大小单双
			endBets.daXiaoDanShuang(i, &dbBetPrize, 0, 3)
			return
		case 110: //后三大小单双
			endBets.daXiaoDanShuang(i, &dbBetPrize, 2, 5)
			return
		}
	}

	return
}
