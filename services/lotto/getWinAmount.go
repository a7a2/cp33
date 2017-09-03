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
					(*endBets.bets)[*i].WinAmount = common.Round(*dbBetPrize * (*endBets.bets)[*i].BetEachMoney)
					return
				}
				break
			} else if j+1 == len(arrayCount[k-start]) { //miss
				return
			}
		}
	}
}

func (endBets *endBets) sum_97_63(i *int, dbBetPrize *float64, start, end int) {
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
			(*endBets.bets)[*i].WinAmount = (*endBets.bets)[*i].WinAmount + common.Round(*dbBetPrize*(*endBets.bets)[*i].BetEachMoney)
			return
		}

	}
}

func (endBets *endBets) skip91_57(i *int, dbBetPrize *float64, start, end int) {
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
					(*endBets.bets)[*i].WinAmount = (*endBets.bets)[*i].WinAmount + common.Round(*dbBetPrize*(*endBets.bets)[*i].BetEachMoney)
				}
				break
			} else if k == len(arrayBetCode)-1 { //miss
				return
			}
		}
	}
}

//0&6&7  797
func (endBets *endBets) zuXuanBaoDan(i *int, dbBetPrizeSplit *[]float64, start, end int) {
	dataSplit := make([]int, end-start)
	arrayBetCode := regexp.MustCompile(`[0-9]{1}`).FindAllString((*endBets.bets)[*i].BetCode, -1)
	for j := 0; j < len(dataSplit); j++ {
		match := 0
		strDataSplit := strconv.Itoa(dataSplit[j])
		for k := 0; k < len(arrayBetCode); k++ {
			if arrayBetCode[k] == strDataSplit { //中了
				match = match + 1

			}
			if k == len(arrayBetCode)-1 {
				switch match {
				case 1:
					(*endBets.bets)[*i].WinAmount = (*endBets.bets)[*i].WinAmount + common.Round((*dbBetPrizeSplit)[1]*(*endBets.bets)[*i].BetEachMoney)
				case 2:
					(*endBets.bets)[*i].WinAmount = (*endBets.bets)[*i].WinAmount + common.Round((*dbBetPrizeSplit)[0]*(*endBets.bets)[*i].BetEachMoney)
				default:
					break
				}
			}
		}
	}

}

func (endBets *endBets) getWinAmount(i *int) (betRewardMoney float64) { //获取中奖注数
	//	var tmpBetCodeSplit, tmpBetCodeOne []string
	//	var intBetCount int //中奖注数
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
	case 1, 7, 8, 11:
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
		case 88: //后3直选复式
			endBets.zhiXuanFuShi(i, &dbBetPrize, 2, 5)
			return
		case 90: //后3直选和值
			endBets.sum_97_63(i, &dbBetPrize, 2, 5)
			return
		case 91: //后3直选跨度
			endBets.skip91_57(i, &dbBetPrize, 2, 5)
			return
		case 92: //后三组合
			endBets.houSanZuSanFuShi(i, &dbBetPrizeSplit[0], 2, 5)
			endBets.houSanZuSanFuShi(i, &dbBetPrizeSplit[1], 3, 5)
			endBets.houSanZuSanFuShi(i, &dbBetPrizeSplit[2], 4, 5)
			return
		case 93: //后三 组三复式
			if !(endBets.dataSplit[0] == endBets.dataSplit[1] || endBets.dataSplit[1] == endBets.dataSplit[2] || endBets.dataSplit[0] == endBets.dataSplit[2]) { //没有两个相同跳过
				return
			}
			if endBets.dataSplit[0] == endBets.dataSplit[1] && endBets.dataSplit[1] == endBets.dataSplit[2] { //三个一样的跳过
				return
			}
			endBets.houSanZuSanFuShi(i, &dbBetPrize, 2, 5)
			return
		case 94: //后三 组六复式
			if !(endBets.dataSplit[0] == endBets.dataSplit[1] || endBets.dataSplit[1] == endBets.dataSplit[2] || endBets.dataSplit[0] == endBets.dataSplit[2]) { //没有两个相同跳过
				return
			}
			if endBets.dataSplit[0] == endBets.dataSplit[1] && endBets.dataSplit[1] == endBets.dataSplit[2] { //三个一样的跳过
				return
			}
			endBets.houSanZuSanFuShi(i, &dbBetPrize, 2, 5)
			return
		case 97: //后三 组选和值 ，和值3 开奖号码：后三位 003 中第一个赔率，012中第二个赔率
			endBets.sum_97_63(i, &dbBetPrizeSplit[0], 2, 5)
			endBets.sum_97_63(i, &dbBetPrizeSplit[1], 3, 5)
			return
		case 99: //后三 组选包胆 .......
			if endBets.dataSplit[0] == endBets.dataSplit[1] && endBets.dataSplit[1] == endBets.dataSplit[2] { //三个一样的跳过
				return
			}
			endBets.zuXuanBaoDan(i, &dbBetPrizeSplit, 2, 5)
			return
		}

	}

	//(*endBets.bets)[*i].WinAmount = common.Round(float64(intBetCount) * dbBetPrize * (*endBets.bets)[*i].BetEachMoney)
	return
}
