const express = require('express')
const router = express.Router()
const needle = require('needle')
const url = require('url')
require('dotenv').config()

const API_KEY_VALUE = process.env.API_KEY_VALUE

router.get('/',async (req,res)=>{
    // console.log('enteres')
    try {
        const ticker = req.query.tickername.toUpperCase();

        const reqone = await needle("get", `https://finnhub.io/api/v1/stock/social-sentiment?symbol=${ticker}&from=2022-01-01&token=${API_KEY_VALUE}`)
        const reqtwo = await needle("get", `https://finnhub.io/api/v1/stock/recommendation?symbol=${ticker}&token=${API_KEY_VALUE}`)
        const reqthree = await needle("get", `https://finnhub.io/api/v1/stock/earnings?symbol=${ticker}&token=${API_KEY_VALUE}`)

        // console.log(reqone)
        const dataone = reqone.body
        const datatwo = reqtwo.body
        const datathree = reqthree.body

        res.status(200).json({1:dataone,2:datatwo,3:datathree})
    }
    catch(error){
        res.status(500).json({error})
    }
})

module.exports = router