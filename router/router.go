package routers

import (
	"cp33/common"
	"cp33/controllers"
	"cp33/models"
	"cp33/services/lotto"
	"strconv"
	"sync"

	"github.com/kataras/iris"
	"github.com/kataras/iris/websocket"
)

func init() {
	models.App = iris.New()
	models.App.RegisterView(iris.HTML("./templates/default", ".html").Reload(true))
	models.App.StaticWeb("/wap/", "./templates/default/wap/")

	models.App.Get("/", func(ctx iris.Context) { ctx.View("index.html") })             //首页
	models.App.Get("/moneyInNotice", controllers.MoneyInNotice)                        //充值到账通知
	models.App.Get("/dataInNotice/{gameID:int}/{issue:int}", controllers.DataInNotice) //采集入库后通知 存储过程太复杂 这个方法简单点，这里是开奖入口
	models.App.Get("/apiMyself/{gameID:int}", func(ctx iris.Context) {                 //给采集客户端使用的接口，用于统一期号等数据，输出最后一期等信息
		ctx.Params().Visit(func(name string, value string) {
			//ctx.Writef("%s = %s\n", name, value)
			gameID, err := strconv.Atoi(value)
			if err == nil {
				r := servicesLotto.OpenInfo(gameID)
				ctx.JSON(r.Data)
			}
		})
	})

	indexParty := models.App.Party("/index")
	indexParty.Post("/login.html", func(ctx iris.Context) { //提交登陆
		b := controllers.Base{ctx}
		b.Login()
	})
	indexParty.Get("/captcha.html", common.StartCaptcha)           //验证码 ...可使用还需要完善
	indexParty.Post("/ajaxRegister.html", func(ctx iris.Context) { //提交注册入口
		b := controllers.Base{ctx}
		b.Signup()
	})
	indexParty.Get("/index.html", func(ctx iris.Context) { ctx.View("index/index.html") })       //内容首页导航
	indexParty.Get("/login.html", func(ctx iris.Context) { ctx.View("index/login.html") })       //登陆页面
	indexParty.Get("/register.html", func(ctx iris.Context) { ctx.View("index/register.html") }) //注册页面

	mineParty := models.App.Party("/mine")                                                               //我的
	mineParty.Get("/index.html", func(ctx iris.Context) { ctx.View("mine/index.html") })                 //个人中心
	mineParty.Get("/betDetail.html", func(ctx iris.Context) { ctx.View("mine/betDetail.html") })         //投注记录详细
	mineParty.Get("/betList.html", func(ctx iris.Context) { ctx.View("mine/betList.html") })             //投注记录
	mineParty.Get("/accountDetail.html", func(ctx iris.Context) { ctx.View("mine/accountDetail.html") }) //账户明细
	mineParty.Post("/ajaxBetList.html", controllers.BetList)                                             //提交查询投注记录入口
	mineParty.Post("/ajaxAccountDetail.html", controllers.AccountDetail)                                 //提交查询账户明细入口

	doBetParty := models.App.Party("/doBet")              //彩票投注相关
	doBetParty.Post("/ajaxBet.html", controllers.PostBet) //投注提交投注入口

	helpParty := models.App.Party("/help")                                                       //优惠信息
	helpParty.Get("/promotion.html", func(ctx iris.Context) { ctx.View("help/promotion.html") }) //优惠信息页面

	betParty := models.App.Party("/bet")                                               //彩票信息展示及选号页面相关
	betParty.Get("/cqssc.html", func(ctx iris.Context) { ctx.View("bet/cqssc.html") }) //重庆时时彩投注页面
	betParty.Get("/xjssc.html", func(ctx iris.Context) { ctx.View("bet/xjssc.html") }) //新疆时时彩投注页面

	trendParty := models.App.Party("/trend")                                               //走势图
	trendParty.Get("/index.html", func(ctx iris.Context) { ctx.View("trend/index.html") }) //走势图展示页面
	trendParty.Post("/ajaxList.html", controllers.PostTrend)                               //走势图请求入口

	//-----------------我是sb的分界线----websocket start----------------------//
	//---------------主要用于推送开奖信息、投注时间、金额变动、短信消息等-----------//
	ws := websocket.New(websocket.Config{
	// to enable binary messages (useful for protobuf):
	// BinaryMessages: true,
	})
	var WsMutex = new(sync.Mutex)
	models.App.Get("my_endpoint", ws.Handler())
	ws.OnConnection(func(c websocket.Connection) {
		WsMutex.Lock()
		models.WsConn[c] = true
		WsMutex.Unlock()
		controllers.WsMain(c)
	})
	//-----------------我是sb的分界线----websocket end------------------------//
}
