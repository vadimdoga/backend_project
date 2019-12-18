const mongoose = require("mongoose")
const Schema = mongoose.Schema

const storeSchema = new Schema({
  storeName: {
    type: String,
    unique: true,
    required: true,
    min: 4,
    max: 255
  },
  storeEmail: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  storeAddress: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  storeImage: {
    data: Buffer,
    contentType: String
  },
  userId: String
})

module.exports = mongoose.model("Store", storeSchema)
