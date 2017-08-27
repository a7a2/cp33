package common

import (
	"image/color"
	"image/png"

	//"net/http"
	"cp33/models"

	"github.com/afocus/captcha"
	"github.com/kataras/iris"
)

var cap *captcha.Captcha

func StartCaptcha(ctx iris.Context) {
	cap = captcha.New()
	if err := cap.SetFont("Duality.ttf"); err != nil {
		panic(err.Error())
	}

	/*
	   //We can load font not only from localfile, but also from any []byte slice
	   	fontContenrs, err := ioutil.ReadFile("comic.ttf")
	   	if err != nil {
	   		panic(err.Error())
	   	}

	   	err = cap.AddFontFromBytes(fontContenrs)
	   	if err != nil {
	   		panic(err.Error())
	   	}
	*/

	cap.SetSize(80, 50)
	cap.SetDisturbance(captcha.MEDIUM)
	cap.SetFrontColor(color.RGBA{255, 255, 255, 255})
	cap.SetBkgColor(color.RGBA{255, 0, 0, 255}, color.RGBA{0, 0, 255, 255}, color.RGBA{0, 153, 0, 255})

	img, str := cap.Create(4, captcha.NUM)
	//	var tempTimeInt64 int64

	//	if time.Now().Unix()+300/1000 == time.Now().Unix()/1000 {
	//		tempTimeInt64 = time.Now().Unix() / 1000
	//	} else {
	//		tempTimeInt64 = time.Now().Unix() + 300/1000
	//	}
	models.MapCaptcha[ctx.RemoteAddr()] = str
	//ctx.Session().SetFlash(ctx.RemoteAddr(), str)
	ctx.ContentType("image/png")

	png.Encode(ctx.ResponseWriter(), img)
	//println(str)
	//	http.ListenAndServe(":8085", nil)
}
