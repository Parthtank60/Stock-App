const express = require('express')
const router = express.Router()
const needle = require('needle')
const url = require('url')
require('dotenv').config()

const API_KEY_VALUE = process.env.API_KEY_VALUE

router.get('/',async (req,res)=>{
    try {
        const ticker = req.query.tickername.toUpperCase();
    const today = new Date()
    currentDate = today.toISOString().slice(0,10)
    priorDate = (new Date(new Date().setDate(today.getDate() - 180))).toISOString().slice(0,10)
        
    let apiRES = await needle("get", `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${priorDate}&to=${currentDate}&token=${API_KEY_VALUE}`)
    // console.log(`https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${priorDate}&to=${currentDate}&token=${API_KEY_VALUE}`)
    let result = []
    const data = apiRES.body
    // console.log(data)
        for(i of data){
            if(i.image.length>0){
                result.push(i)
            }}
        res.send(result)

    } catch (error) {
        res.send(error)
    }
})


module.exports = router