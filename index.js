const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const cors = require('cors')
const Store = require('./Schemas/storeSchema')
const dbConnection = require('./dbConnection')

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send("hello");
});

app.get('/stores', (req, res) => {
  dbConnection.then(db => {
    Store.find({})
    .then(chat => {
      res.json(chat)
    })
    .catch(err => {
      console.log("An error ocurred: ", err)
    })
  })

});

app.post('/stores', (req, res) => {
  dbConnection.then(db => {
    let stores = Store(req.body)
    console.log(stores)
    stores.save(err => {
      if(err === null){
        console.log("Saved to db succesful")
        res.sendStatus(200);
      } else {
        console.log("Error saving to db")
        res.sendStatus(404)
      }
    })
  })
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});