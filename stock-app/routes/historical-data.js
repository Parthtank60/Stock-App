const express = require('express')
const router = express.Router()
const needle = require('needle')
const url = require('url')
require('dotenv').config()

const API_KEY_VALUE = process.env.API_KEY_VALUE
const API_CURRENTPRICE_URL = process.env.API_CURRENTPRICE_URL

router.get('/',async (req,res)=>{
    try {
        // console.log('entered try')
        const ticker = req.query.tickername.toUpperCase();
        const resolution = req.query.resolution;
        // console.log(typeof resolution)

        // const { ticker, resolution  } = req.query
        
        const apiRES = await needle("get", `${API_CURRENTPRICE_URL}symbol=${ticker}&token=${API_KEY_VALUE}`);
        const data = apiRES.body
        // console.log(data)
        
        to = data.t
        // console.log(to)
        // console.log(typeof to)
        if(resolution ==='5'){
            from = to - 21600
        }
        else if(resolution ==='D'){
            from = to - 63072000
        }

        // console.log(from)
        const apires = await needle("get", `
        https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=${resolution}&from=${from}&to=${to}&token=${API_KEY_VALUE}`)
        // console.log(`https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=${resolution}&from=${from}&to=${to}&token=${API_KEY_VALUE}`)
        // console.log(apires)
        const data1 = apires.body
        res.status(200).json(data1)
    }
    catch(e){
        console.log('wrong')
        res.send(e)
        res.status(500).json(e)

    }

})

module.exports = router