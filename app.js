const express =require('express');
const auth =require('./wehcat/auth');
const app=express();
const Wechat=require('./wehcat/wechat');
const wechatapi =new Wechat();
const sha1=require('sha1');
const {url}=require('./config');

//config 模板资源目录
app.set('views',"./views");
//配置模板引擎
app.set('view engine',"ejs");
//页面路由
app.get('/search',async (req,res)=>{
    const noncestr=Math.random().toString(36).substr(2, 15);
    const timestamp =Date.now();
    const {ticket}=await wechatapi.fetTicket();
    console.log(ticket);

    const arr=[
        `jsapi_ticket=${ticket}`,
        `noncestr=${noncestr}`,
        `timestamp=${timestamp}`,
        `url=${url}/search`
    ]
    const str =arr.sort().join('&');
    console.log(str);
    const signature=sha1(str);

res.render('search',{
    signature,
    noncestr,
    timestamp
});
})
app.use(auth());
app.listen(3000,()=>console.log("success"));