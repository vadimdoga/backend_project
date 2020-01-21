const express = require("express")
const app = express()
const https = require("https")
const bodyParser = require("body-parser")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const fs = require("fs")
//Import Routes
const authRoute = require("./routes/auth")
const storeRoute = require("./routes/store")
const productRoute = require("./routes/product")
const profileRoute = require("./routes/profile")
const port = 4000

const key = fs.readFileSync('certs/selfsigned.key', 'utf-8');
const cert = fs.readFileSync('certs/selfsigned.crt', 'utf-8');
const options = {
  key: key,
  cert: cert
};

dotenv.config()

//Middlewares
app.use(bodyParser.json({ limit: "50mb" }))
app.use(cors())

//Connect DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to DB")
)

//Route middleware
app.get("/", (req, res) => {
  res.send("hello world")
})

app.use("/user", authRoute)

app.use("/stores", storeRoute)

app.use("/products", productRoute)

app.use("/profile", profileRoute)

const server = https.createServer(options, app);

server.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
