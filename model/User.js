const mongoose = require("mongoose")
const Schema = mongoose.Schema
mongoose.set("useCreateIndex", true)

const registerSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    min: 6,
    max: 255
  },
  username: {
    type: String,
    required: true,
    min: 2,
    max: 255
  },
  password: {
    type: String,
    required: true,
    min: 7,
    max: 1024
  },
  date: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    required: true,
    default: false
  },
  question: {
    type: String,
    required: true,
    min: 1
  }
})

module.exports = mongoose.model("Register", registerSchema)
