const express = require('express')
const router = express.Router()
const needle = require('needle')
const url = require('url')
require('dotenv').config()

const API_KEY_NAME = process.env.API_KEY_NAME
const API_KEY_VALUE = process.env.API_KEY_VALUE
const API_BASE_URL = process.env.API_BASE_URL

const tcker = "AAPL"

router.get('/',async (req,res)=>{
    try {
        const ticker = req.query.tickername;
        const apiRES = await needle("get", `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${API_KEY_VALUE}`);
        const data = apiRES.body
        res.status(200).json(data)

    } catch (error) {
        res.status(500).json({error})
    }
})

module.exports = router