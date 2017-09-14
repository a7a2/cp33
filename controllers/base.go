package controllers

import (
	"cp33/common"
	"cp33/models"
	"cp33/services/pingtais"
	"cp33/services/user"
	"regexp"

	//	"github.com/go-redis/redis"
	"github.com/kataras/iris"
)

type Base struct { //基础信息
	iris.Context
}

func (self *Base) BaseCheck() bool { //检查用户名是否符合，平台是否存在
	username := self.Context.FormValue("username")
	if username != "" && regexp.MustCompile(`^(_)`).MatchString(username) == true {
		self.Context.JSON(models.Result{Code: 404, Message: "用户名不能以下划线_开头！", Data: nil})
		return false
	}
	if len(username) > 16 {
		self.Context.JSON(models.Result{Code: 404, Message: "用户名太长！", Data: nil})
		return false
	}

	platform := self.Context.FormValue("platform")
	if regexp.MustCompile(`([a-f\d]{8})(\-[a-f\d]{4}){3}(\-([a-f\d]{12}))`).MatchString(platform) == false {
		//self.Context.JSON(models.Result{Code: 404, Message: "没有找到该平台！", Data: nil})
		//没有指定平台的直接跳到第一个默认的
		//self.Context.Redirect("/index/login.html?platform=ce45035d-317e-4831-afe1-05444d9b040a")
		return false
	}

	if common.RedisClient.HExists(platform+"_*", "enclientpasswd").Val() == true {
		return true
	}

	if *(servicesPingtais.GetPlatformId(&platform)) > 0 {
		return true
	}

	//不存在的平台跳转
	//self.Context.Redirect("/index/login.html?platform=ce45035d-317e-4831-afe1-05444d9b040a")
	//self.Context.JSON(result)
	return false
}

func (self *Base) CheckIsLogin() bool {
	cookieEnClientPassWd := self.Context.GetCookie("enclientpasswd")
	cookieUsername := self.Context.GetCookie("username")
	cookiePlatform := self.Context.GetCookie("platform")
	if cookiePlatform == "" || cookieUsername == "" || cookieEnClientPassWd == "" {
		//self.Context.Redirect("/index/login.html?platform=ce45035d-317e-4831-afe1-05444d9b040a")
		//result = models.Result{Code: 404, Message: err.Error(), Data: nil}
		return false
	}

	if common.RedisClient.HExists(cookiePlatform+"_"+cookieUsername, "enclientpasswd").Val() == true {
		//从redis验证
		redisCookieEnClientPassWd := common.RedisClient.HGet(cookiePlatform+"_"+cookieUsername, "enclientpasswd").Val()
		if redisCookieEnClientPassWd == cookieEnClientPassWd {
			//self.Context.JSON(models.Result{Code: 404, Message: "你已经是本站用户！", Data: nil})
			return true
		}
		//解密验证
		if common.DecryptClient(&cookieEnClientPassWd, &cookiePlatform) == common.DecryptClient(&redisCookieEnClientPassWd, &cookiePlatform) {
			return true
		}
	}

	//从数据库验证
	lp := models.LoginPost{
		Username: cookieUsername,
		Platform: cookiePlatform,
		Password: common.DecryptClient(&cookieEnClientPassWd, &cookiePlatform),
	}
	err, result := services.Login(&lp)
	if err == nil && result.Code == 200 { //成功
		return true
	}

	return false
}

func (self *Base) loginSucceed(l *models.LoginCookie) {
	common.RedisClient.HSet(l.Platform+"_"+l.Username, "enclientpasswd", l.Enclientpasswd)
	self.Context.RemoveCookie("username")
	self.Context.RemoveCookie("platform")
	self.Context.RemoveCookie("enclientpasswd")
	self.Context.Header("Set-Cookie", "username="+l.Username+"; Path=/; Expires=Wed, 14 Feb 2987 09:30:00 GMT; Max-Age=11604799")
	self.Context.Header("Set-Cookie", "platform="+l.Platform+"; Path=/; Expires=Wed, 14 Feb 2987 09:30:00 GMT; Max-Age=11604799")
	self.Context.Header("Set-Cookie", "enclientpasswd="+l.Enclientpasswd+"; Path=/; Expires=Wed, 14 Feb 2987 09:30:00 GMT; Max-Age=11604799")
	self.Context.JSON(models.Result{Code: 200, Message: "ok", Data: l})
}
