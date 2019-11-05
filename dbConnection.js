const mongoose = require('mongoose')
const url = "mongodb://localhost:27017/handmade"
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true  })

module.exports = connect