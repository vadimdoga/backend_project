const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.set('useCreateIndex', true)

const registerSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    dropDups: true
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model("Register", registerSchema)