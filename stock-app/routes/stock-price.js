const express = require('express')
const router = express.Router()
const needle = require('needle')
const url = require('url')
require('dotenv').config()

const API_KEY_VALUE = process.env.API_KEY_VALUE
const API_CURRENTPRICE_URL = process.env.API_CURRENTPRICE_URL

const ticker = "AMZN"
// console.log('jojo')

router.get('/',async (req,res)=>{
    try {
        const ticker = req.query.tickername.toUpperCase();
        const apiRES = await needle("get", `${API_CURRENTPRICE_URL}symbol=${ticker}&token=${API_KEY_VALUE}`);
        const data = apiRES.body
        res.status(200).json(data)

    } catch (error) {
        console.log('kk')
        res.status(500).json({error})
    }
})

module.exports = router