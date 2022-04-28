/*
server identify
*/
const express =require('express');
const sha1=require('sha1');
const config = require('../config');
module.exports=()=>{
    return (req,res,next)=>{

        const {signature,echostr,timestamp,nonce}=req.query;
        const {token}=config;
        const arr=[timestamp,nonce,token];
        const arrSort=arr.sort();
//console.log(arrSort);
        const str=arr.join('');
//console.log(str);
        const sha1Str=sha1(str);
        console.log(sha1Str);
        if(sha1Str === signature)
        {
            console.log('yessssss from wechat');
            res.send(echostr);
        }
        else
        {
            res.end('error');
        }
    }
}