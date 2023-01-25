const express = require('express')
const router = express.Router()
const needle = require('needle')
const url = require('url')
require('dotenv').config()

const API_KEY_VALUE = process.env.API_KEY_VALUE
const API_AUTOCOMPLETE_URL = process.env.API_AUTOCOMPLETE_URL

const query = "AMZ"

router.get('/',async (req,res)=>{
    try {
        // const params = new URLSearchParams({
        //     [API_KEY_NAME] : API_KEY_VALUE,
        //     // ...url.parse(req.url,true).query,
        // })
        const queryString = req.query.queryString;
        const apiRES = await needle("get", `${API_AUTOCOMPLETE_URL}q=${queryString}&token=${API_KEY_VALUE}`);
        const data = apiRES.body
        // console.log(data.result)
        let result =[]
        if(queryString ==''){
            // console.log('hi')
            res.send({})
        }
        // console.log('hi2')
        for (i of data.result){
            if(! i.displaySymbol.includes('.') && i.type === 'Common Stock'){
                result.push(i)
            }
        }
        // console.log(result)
        res.send(result)
    }
    catch (e){
        res.send(e)
    }
})

module.exports = router