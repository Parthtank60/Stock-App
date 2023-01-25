const express = require('express')
const router = express.Router()
const needle = require('needle')
const url = require('url')
require('dotenv').config()

const API_KEY_VALUE = process.env.API_KEY_VALUE


router.get('/',async (req,res)=>{
try {
    const ticker = req.query.tickername.toUpperCase();
    const apiRES = await needle("get", `https://finnhub.io/api/v1/stock/recommendation?symbol=${ticker}&token=${API_KEY_VALUE}`);
    const data = apiRES.body
    result={}
        result.buy=[]
        result.sell=[]
        result.hold=[]
        result.strongBuy=[]
        result.strongSell=[]
        for (i of data){
            result.buy.push(i.buy)
            result.sell.push(i.sell)
            result.hold.push(i.hold)
            result.strongBuy.push(i.strongBuy)
            result.strongSell.push(i.strongSell)
        }
        res.send(result)
    
} catch (error) {
    res.send(error)
}

})

module.exports = router