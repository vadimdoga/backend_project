const express = require('express')
const app = express()
const session = require('express-session')
const port = 3000
const bodyParser = require('body-parser')
const cors = require('cors')
//mongo
const dbConnection = require('./dbConnection')
const Store = require('./Schemas/storeSchema')
const Register = require('./Schemas/Auth/registerSchema')

app.use(session({
  secret: 'secretstuff',
  resave: true,
  saveUninitialized: false
}));

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
        console.log("Error saving to db. " + err)
        res.sendStatus(400)
      }
    })
  })
});

app.post('/auth/register', (req, res) => {
  if(req.body.email && req.body.username && req.body.password) {
    dbConnection.then(db => {
        let registerData = Register(req.body)
        console.log(registerData)
        registerData.save(err => {
          if(err === null){
            console.log("Saved to db successful")
            res.sendStatus(200);
          } else {
            console.log("Error saving to db.", err.errmsg)
            res.sendStatus(401)
          }
        })
    })  
  } else {
    console.log("There is missing something in the form.")
    res.sendStatus(400)
  }
});

app.post('/auth/login', (req, res) => {
  if(req.body.email && req.body.password) {
    dbConnection.then(db => {
      Register.findOne({email: req.body.email})
        .then(user => {
          if(req.body.password == user.password){
            console.log("True password")
            req.session.userId = user._id
            res.sendStatus(200)
          } else {
            console.log("False password")
            res.sendStatus(406);
          }
        })
        .catch(err => {
          console.log("There is no such user.", err)
          res.sendStatus(401)
        })
    })
  } else {
    console.log("There is missing something in the form.")
    res.sendStatus(400)
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});