package servicesLotto

import (
	"cp33/models"
	"cp33/services/user"
	"fmt"

	"strconv"
	"strings"
	"time"

	"github.com/go-pg/pg"
)

func DoBets(us []models.Bets, uid int) (result models.Result) {
	tx, err := models.Db.Begin()
	if err != nil {
		result = models.Result{Code: 500, Message: err.Error(), Data: nil}
		return
	}

	m := models.Members{}

	_, err = tx.QueryOne(&m, fmt.Sprintf("select coin from members where uid=%v limit 1 for update", uid))
	//err = tx.Model(&m).Where("uid=?", uid).Returning("coin").Select()
	if err != nil {
		fmt.Println(err.Error())
		tx.Rollback()
		result = models.Result{Code: 601, Message: "数据库错误!", Data: nil}
		return
	}

	coin := m.Coin - us[0].Amount*float64(us[0].BetMore)
	if coin < 0 {
		tx.Rollback()
		result = models.Result{Code: 601, Message: "余额不足本次消费!", Data: nil}
		return
	}
	_, err = tx.Model(&m).Set("coin=?", strconv.FormatFloat(coin, 'f', 3, 64)).Where("uid=?", uid).Update()
	if err != nil {
		fmt.Println(err.Error())
		tx.Rollback()
		result = models.Result{Code: 601, Message: "数据库错误!", Data: nil}
		return
	}

	err = tx.Insert(&us)
	if err != nil {
		fmt.Println(err.Error())
		tx.Rollback()
		result = models.Result{Code: 600, Message: "数据库错误!", Data: nil}
		return
	}

	err = tx.Commit()
	if err != nil {
		fmt.Println(err.Error())
		result = models.Result{Code: 600, Message: "数据库错误!", Data: nil}
		return
	}

	result = models.Result{Code: 200, Message: "ok", Data: nil}
	return
}

func BetList(bl *models.AjaxBetList, platform, username string) (result models.Result) {
	//strSql := fmt.Sprintf("select id,amount,bet_count,bet_prize,bet_reward,ctime,is_win,sub_name,bet_code,play_id,game_id,win_amount,game_period,open_num,status,bet_pos,etime from bets where uid=%v ", services.GetUid(platform, username))

	strSql := fmt.Sprintf("uid=%v and is_delete=false", services.GetUid(platform, username))
	switch bl.OrderType {
	case 0: //0 全部
		break
	case 1: //1追号
		strSql = fmt.Sprintf(" %s%s", strSql, " and bet_next<>0")
	case 2: //中奖
		strSql = fmt.Sprintf(" %s%s", strSql, " and is_win=true")
	case 3: //3待开奖
		strSql = fmt.Sprintf(" %s%s", strSql, " and open_num=''")
	case 4: //4撤单
		strSql = fmt.Sprintf(" %s%s", strSql, " and status=2")
	}

	us := []models.Bets{}
	total, err := models.Db.Model(&us).Where(strSql).Limit(20).Offset((bl.PageIndex - 1) * 20).Order("id DESC").SelectAndCount()
	if err != nil {
		result = models.Result{Code: 500, Message: err.Error(), Data: nil}
		return
	}

	out := map[string]interface{}{"PageCount": total / 20, "Records": &us}
	result = models.Result{Code: 200, Message: "ok", Data: &out}
	return
}

type endBets struct {
	bets      *[]models.Bets
	tx        *pg.Tx
	strIp     string
	data      string
	dataSplit []string
	etime     time.Time
}

func EndLottery(gameId, period int, strIp string) { //结算
	var d *models.Data
	d = OpenData(gameId, 0, 1, period)
	if d == nil {
		fmt.Println("EndLottery 98")
		return
	}
	fmt.Println(d.Data, "	", d.Issue)

	var bets []models.Bets
	var err error
	tx, err := models.Db.Begin()
	if err != nil {
		fmt.Println("services EndLottery 108," + err.Error())
		return
	}
	_, err = tx.Query(&bets, fmt.Sprintf("select * from bets where game_id=%v and game_period=%v and open_num='' and is_delete=false for update", gameId, period))
	if err != nil || len(bets) == 0 {
		fmt.Println("services EndLottery 113 len(bets)=", len(bets))
		tx.Rollback()
		return
	}
	etime, _ := time.ParseInLocation("2006-01-02 15:04:05", time.Now().Format("2006-01-02 15:04:05"), time.Local) //结算时间
	dataSplit := strings.Split(d.Data, " ")
	endBets := endBets{bets: &bets, tx: tx, strIp: strIp, dataSplit: dataSplit, data: d.Data, etime: etime}
	endBets.betClose1()

	_, err = tx.Model(&bets).Column("open_num", "status", "etime", "win_amount", "is_win").Update()
	if err != nil {
		fmt.Println("services EndLottery 215:" + err.Error())
		tx.Rollback()
		return
	}

	err = tx.Commit()
	if err != nil {
		fmt.Println("services EndLottery 107" + err.Error())
		return
	}
	return
}

func (endBets *endBets) betClose1() {
	var err error
	//var member models.Members
	var bet models.Bets
	var betRewardMoney float64 //返奖金额

	for i := 0; i < len(*endBets.bets); i++ {
		betRewardMoney = endBets.getWinAmount(&i) //获取中奖金额、返回返点金额
		fmt.Println(" 游戏编号：", (*endBets.bets)[i].SubId, " 单号：", (*endBets.bets)[i].Id, "	 win:", (*endBets.bets)[i].WinAmount, "投注金额：", (*endBets.bets)[i].BetMoney)

		if betRewardMoney > 0 { //返点
			endBets.addMoney(&betRewardMoney, &i, 2, "返点")
		}
		(*endBets.bets)[i].IsWin = false
		(*endBets.bets)[i].OpenNum = endBets.data
		(*endBets.bets)[i].Status = 1
		(*endBets.bets)[i].Etime = endBets.etime
		if (*endBets.bets)[i].WinAmount > 0 { //赢了de
			(*endBets.bets)[i].IsWin = true
			endBets.addMoney(&(*endBets.bets)[i].WinAmount, &i, 5, "中奖")
			if (*endBets.bets)[i].BetWinStop == 1 && (*endBets.bets)[i].BetMore > 1 { //选了中奖后停止追号的 及 追了期的...要取消
				_, err = endBets.tx.Model(&bet).Set("status=2, etime=?", endBets.etime).Where("label=? and ctime=? and game_id=? and game_period>? and open_num='' and is_delete=false and status=0", (*endBets.bets)[i].Label, (*endBets.bets)[i].Ctime, (*endBets.bets)[i].GameId, (*endBets.bets)[i].GamePeriod).Update()
				if err != nil {
					fmt.Println(err.Error())
					endBets.tx.Rollback()
					return
				}
				endBets.addMoney(&(*endBets.bets)[i].BetMoney, &i, 4, "撤单")
			}
		}

	} //完成len(bets)

}

func (endBets *endBets) addMoney(money *float64, i *int, liqType int, info string) {
	balance := services.CoinChangeByUid((*endBets.bets)[*i].Uid, *money, endBets.tx) //取消返回投注金额
	coinLog := models.CoinLog{
		Uid:        (*endBets.bets)[*i].Uid,
		Type:       (*endBets.bets)[*i].GameId,
		OrderId:    (*endBets.bets)[*i].Id,
		Coin:       *money,
		FreezeCoin: 0.000,
		Balance:    balance,
		LiqType:    liqType,
		ActionUid:  0,
		Ctime:      endBets.etime,
		ActionIp:   endBets.strIp,
		Info:       fmt.Sprintf("%s%v", info, (*endBets.bets)[*i].Id),
	}
	services.CoinLog(&coinLog, endBets.tx)
}
