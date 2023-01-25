const express = require('express')
const router = express.Router()
const needle = require('needle')
const url = require('url')
require('dotenv').config()

const API_KEY_VALUE = process.env.API_KEY_VALUE

router.get('/', async (req, res) =>{
    try{
        const ticker = req.query.tickername;
        const apiRES = await needle("get", `https://finnhub.io/api/v1/stock/earnings?symbol=${ticker}&token=${API_KEY_VALUE}`);
        const data = apiRES.body
        res.send(data)


    }
    catch(e){
        res.send(e)
    }

})

module.exports = router