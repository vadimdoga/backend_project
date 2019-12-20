const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
//Import Routes
const authRoute = require("./routes/auth")
const storeRoute = require('./routes/store')
const productRoute = require('./routes/product')
const profileRoute = require('./routes/profile')

const port = 4000

dotenv.config()

//Middlewares
app.use(bodyParser.json())
app.use(cors())

//Connect DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to DB")
)

//Route middleware
app.get('/', (req, res) => {
  res.send("hello world");
});

app.use("/users", authRoute)

app.use("/stores", storeRoute)

app.use("/products", productRoute)

app.use("/profile", profileRoute)

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
