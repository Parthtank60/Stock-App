const express = require('express')
const cors = require('cors')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())

app.use('/search',require('./routes/company-search.js'))
app.use('/current-price',require('./routes/stock-price.js'))
app.use('/autocomplete-text',require('./routes/autocomplete.js'))
app.use('/get-company-peers',require('./routes/companypeers.js'))
app.use('/get-historical-data',require('./routes/historical-data.js'))
app.use('/insights',require('./routes/insights.js'))
app.use('/get-latest-news',require('./routes/news.js'))
app.use('/get-recommendation-trends',require('./routes/recommend.js'))
app.use('/get-company-earnings',require('./routes/earnings.js'))





app.listen(PORT, () => console.log(`server running ${PORT}`))
