
const {appID,appsecret}=require('../config');
const rp =require('request-promise-native');
const {writeFile,readFile}=require('fs');
class Wechat{
    constructor() {
    }


    getAccessToken() {
        const url=`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
return new Promise((resolve,reject)=>{
    rp({method:'GET',url,json:true})
        .then(res =>{
            res.expires_in =Date.now()+(res.expires_in -300)*1000;
            resolve(res);
        })
        .catch(err =>{
            console.log(err);
            reject('getAccessToken errrrrr!!!'+err);
        })

})

    }
    saveAccessToken(accessToken){
        accessToken=JSON.stringify(accessToken);
        return new Promise((resolve,reject)=>{
            writeFile('./accessToken.txt',accessToken,err=>{
                if(!err)
                {
                    console.log('save success');
                    resolve();
                }else
                {
                    reject("save errrrrrr!!!!"+err);_
                }

            })
        })

}
    readAccessToken(){
        return new Promise((resolve,reject)=>{
            readFile('./accessToken.txt',(err,data)=>{
                if(!err)
                {
                    console.log('read success');
                    data=JSON.parse(data);
                    resolve(data);
                }else
                {
                    reject("read errrrrrr!!!!"+err);
                }

            })
        })
    }
    isValidAccessToken(data){
        if(!data && !data.access_token && !data.expires_in)
        {
            return false;
        }
        return data.expires_in<Data.now();
    }
    fetAccseeToken(){
        if(this.access_token &&this.expires_in && this.isValidAccessToken())
        {
            return Promise.resolve({
                access_token:this.access_token,
                expires_in:this.expires_in
            })
        }

            return this.readAccessToken()
                .then(async res => {
                    if (this.isValidAccessToken(res)) {
                        return Promise.resolve(res);
                        //  resolve(res);
                    } else {
                        const res = await this.getAccessToken()
                        await this.saveAccessToken(res)
                        // resolve(res);
                        return Promise.resolve(res);
                    }
                })
                .catch(async err => {
                    const res = await this.getAccessToken()
                    await this.saveAccessToken(res)
                    //  resolve(res);
                    return Promise.resolve(res);
                })
                .then(res => {
                    this.access_token = res.access_token;
                    this.expires_in = res.expires_in;
                    //this.readAccessToken() finally return val
                    return Promise.resolve(res);
                })
        }


    getJspiTicket() {

        return new Promise(async (resolve,reject)=>{
            const data=await this.fetAccseeToken();
           console.log(data.access_token);
            const url=`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${data.access_token}&type=jsapi`;
            console.log(url);
            rp({method:'GET',url,json:true})
                .then(res =>{
                    resolve({
                        ticket:res.ticket,
                        expires_in:Date.now()+(res.expires_in -300)*1000
                    });
                })
                .catch(err =>{
                    console.log(err);
                    reject('getTicket errrrrr!!!'+err);
                })

        })

    }
    saveJTicket(ticket){
        ticket=JSON.stringify(ticket);
        return new Promise((resolve,reject)=>{
            writeFile('./ticket.txt',ticket,err=>{
                if(!err)
                {
                    console.log('save ticket success');
                    resolve();
                }else
                {
                    reject("save ticket errrrrrr!!!!"+err);_
                }

            })
        })

    }
    readJTicketn(){
        return new Promise((resolve,reject)=>{
            readFile('./ticket.txt',(err,data)=>{
                if(!err)
                {
                    console.log('read ticket success');
                    data=JSON.parse(data);
                    resolve(data);
                }else
                {
                    reject("read ticket errrrrrr!!!!"+err);
                }

            })
        })
    }
    isValidTicket(data){
        if(!data && !data.ticket && !data.expires_in)
        {
            return false;
        }
        return data.expires_in<Data.now();
    }
    fetTicket(){
        if(this.ticket &&this.ticket_expires_in && this.isValidTicket())
        {
            return Promise.resolve({
                ticket:this.ticket,
                expires_in:this.expires_in
            })
        }

        return this.readJTicketn()
            .then(async res => {
                if (this.isValidTicket(res)) {
                    return Promise.resolve(res);
                    //  resolve(res);
                } else {
                    const res = await this.getJspiTicket()
                    await this.saveJTicket(res)
                    // resolve(res);
                    return Promise.resolve(res);
                }
            })
            .catch(async err => {
                const res = await this.getJspiTicket()
                await this.saveJTicket(res)
                //  resolve(res);
                return Promise.resolve(res);
            })
            .then(res => {
                this.ticket = res.ticket;
                this.ticket_expires_in = res.expires_in;
                //this.readAccessToken() finally return val
                return Promise.resolve(res);
            })
    }

}
//const w=new Wechat();

// new Promise((resolve,reject)=>{
// w.readAccessToken()
//     .then(res=>{
//        if(w.isValidAccessToken(res))
//        {
//     resolve(res);
//        }else
//        {
//            w.getAccessToken()
//                .then(res=>{
//                    w.saveAccessToken(res)
//                        .then(()=>{
//                            resolve(res);
//                        })
//                })
//        }
//
//     })
//     .catch(err=>{
//         w.getAccessToken()
//             .then(res=>{
//                 w.saveAccessToken(res)
//                     .then(()=>{
//                         resolve(res);
//                     })
//         })
//     })
// })
//     .then(res=>{
//         console.log(res);
//     })
module.exports=Wechat;