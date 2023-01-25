const express = require('express')
const router = express.Router()
const needle = require('needle')
const url = require('url')
require('dotenv').config()

const API_KEY_VALUE = process.env.API_KEY_VALUE
const API_AUTOCOMPLETE_URL = process.env.API_AUTOCOMPLETE_URL

router.get('/', async (req, res) =>{
    const symbol = req.query.symbol;
    // console.log(symbol)
    try{
        const data = await needle("get", `https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${API_KEY_VALUE}`);
        // let data = await axios.get(`https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${API_KEY_VALUE}`)
        // console.log(data.body)
        res.send(data.body)
    }
    catch(e){
        res.send(e)
    }
})

module.exports = router