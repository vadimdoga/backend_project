const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

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

//Import Routes
const authRoute = require("./routes/auth")

//Route middleware
app.get('/', (req, res) => {
  res.send("hello world");
});

app.use("/user", authRoute)


app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
