const express = require("express");
const app = express();
const session = require("express-session");
const port = 4000;
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require('fs')
//mongo
const dbConnection = require("./dbConnection");
const Store = require("./Schemas/storeSchema");
const Product = require("./Schemas/productSchema");
const Register = require("./Schemas/Auth/registerSchema");
//security
const bcrypt = require("bcrypt");
const saltRounds = 10;

function readPasswordFile(path, password){
  const commonPasswords = fs.readFileSync(path, 'utf8')
  if(password === commonPasswords){
    console.log("Password in common passwords!")
    return false
  } else {
    console.log("Password not in common passwords!")
    return true
  }
  
}
function verifyPasswordStrength(password){
  let i = 0
  while(i < password.length){
    ch = password.charAt(i)
    if(ch === ch.toUpperCase()){
      if(password.length === 7){
        verifyForCommonPasswords = readPasswordFile('10k-passwords.txt', password)
        if(verifyForCommonPasswords){
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
    i = i + 1
  }
  return false
}

app.use(
  session({
    secret: "secretstuff",
    resave: true,
    saveUninitialized: false
  })
);

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/stores", (req, res) => {
  dbConnection.then(db => {
    Store.find({})
      .then(store => {
        res.json(store);
      })
      .catch(err => {
        console.log("An error ocurred: ", err);
      });
  });
});

app.post("/stores", (req, res) => {
  if (req.session.userId) {
    if (
      req.body.storeName &&
      req.body.storeEmail &&
      req.body.storeAddress &&
      req.body.storeImage
    ) {
      req.body.userId = req.session.userId;
      console.log(req.session.userId);
      dbConnection.then(db => {
        let stores = Store(req.body);
        console.log(stores);
        stores.save(err => {
          if (err === null) {
            console.log("Saved to db succesful");
            res.sendStatus(200);
          } else {
            console.log("Error saving to db. " + err);
            res.sendStatus(400);
          }
        });
      });
    }
  } else {
    console.log("User is not connected.");
    res.sendStatus(401);
  }
});

app.put('/stores/:id', (req, res) => {
  if(req.session.id){
    if (
      req.body.storeName ||
      req.body.storeEmail ||
      req.body.storeAddress ||
      req.body.storeImage
    ) {
      Store.findOne({_id: req.params.id})
        .then(store => {
          if(
            req.body.storeName !== store.storeName && 
            req.body.storeEmail !== store.storeName &&
            req.body.storeAddress !== store.storeAddress && 
            req.body.storeImage !== store.storeImage
          ){
            req.body.storeName ? (store.storeName = req.body.storeName) : null;
            req.body.storeEmail ? (store.storeEmail = req.body.storeEmail) : null;
            req.body.storeAddress ? (store.storeAddress = req.body.storeAddress) : null;
            req.body.storeImage ? (store.storeImage = req.body.storeImage) : null;
            console.log(store)
            store.save()
              .then(() => {
                res.json("Store updated");
              })
              .catch(err => {
                console.log("Error saving to db", err)
              })
          } else {
            console.log("You need to introduce new data not the old one.")
            res.sendStatus(406)
          }
        })
        .catch(err => {
          console.log("Such store does not exist!", err)
          res.sendStatus(404)
        })
    }
  } else {
    console.log("User is not connected.");
    res.sendStatus(401);
  }
});

app.post("/auth/register", (req, res) => {
  if (req.body.email && req.body.username && req.body.password) {
    if(verifyPasswordStrength(req.body.password)){
      const hash = bcrypt.hashSync(req.body.password, saltRounds);
      dbConnection.then(db => {
        let registerData = Register({
          email: req.body.email,
          username: req.body.username,
          password: hash
        });
        console.log(registerData);
        registerData.save(err => {
          if (err === null) {
            console.log("Saved to db successful");
            res.sendStatus(200);
          } else {
            console.log("Error saving to db.", err.errmsg);
            res.sendStatus(401);
          }
        });
      });
    } else {
      console.log("Weak password")
      res.sendStatus(406)
    }
  } else {
    console.log("There is missing something in the form.");
    res.sendStatus(400);
  }
  
});

app.post("/auth/login", (req, res) => {
  if (req.body.email && req.body.password) {
    dbConnection.then(db => {
      Register.findOne({ email: req.body.email })
        .then(user => {
          const verifyPassword = bcrypt.compareSync(
            req.body.password,
            user.password
          );
          if (verifyPassword) {
            console.log("User connected succesfull.");
            req.session.userId = user._id;
            res.sendStatus(200);
          } else {
            console.log("Wrong password.");
            res.sendStatus(406);
          }
        })
        .catch(err => {
          console.log("There is no such user.", err);
          res.sendStatus(401);
        });
    });
  } else {
    console.log("There is missing something in the form.");
    res.sendStatus(400);
  }
});

app.get("/auth/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.log(err);
      } else {
        console.log("User disconnected successful.")
        return res.redirect("/");
      }
    });
  }
});

app.put("/profile/edit", (req, res) => {
  if (req.session.userId) {
    if (req.body.username || req.body.password) {
      dbConnection.then(db => {
        Register.findById(req.session.userId)
          .then(user => {
            const verifyPassword = bcrypt.compareSync(
              req.body.password,
              user.password
            );
            if (verifyPassword && req.body.password) {
              req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
            }
            if(user.username !== req.body.username && verifyPassword === false){
              req.body.username ? (user.username = req.body.username) : null;
              req.body.password ? (user.password = req.body.password) : null;
              console.log(user);
              user.save()
                .then(() => {
                  res.json("Profile updated");
                })
                .catch(err => {
                  console.log("Error saving to db", err)
                })
            } else {
              console.log("You need to introduce new data not the old one.")
              res.sendStatus(406)
            }
          })
          .catch(err => {
            console.log("Couldn't find this id", err);
            res.sendStatus(404);
          });
      });
    } else {
      console.log("Nothing has been introduced.");
      res.sendStatus(404);
    }
  } else {
    console.log("User is not connected.");
    res.sendStatus(401);
  }
});

app.post("/products", (req, res) => {
  if (req.session.userId) {
    if (
      req.body.productTitle &&
      req.body.productCategories &&
      req.body.productImages &&
      req.body.productPrice &&
      req.body.storeName
    ) {
      dbConnection.then(db => {
        Store.findOne({ 
          userId: req.session.userId,
          storeName: req.body.storeName
        })
        .then(store => {
          req.body.storeId = store._id
          let product = new Product(req.body)
          console.log(product)
          product.save(err => {
            if (err === null) {
              console.log("Saved to db succesful");
              res.sendStatus(200);
            } else {
              console.log("Error saving to db. " + err);
              res.sendStatus(400);
            }
          })
        })
        .catch(err => {
          console.log("Store not found", err)
          res.sendStatus(404)
        }) 
      })
    }
  } else {
    console.log("User is not connected.");
    res.sendStatus(401);
  }
});

app.get("/products", (req, res) => {
  dbConnection.then(db => {
    Product.find()
      .then(products => {
        res.json(products);
      })
      .catch(err => {
        console.log("An error ocurred: ", err);
      });
  });
});

app.delete('/products/:id', (req, res) => {
  if(req.session.userId){
    const requestId = req.params.id
    const storeIds = []
    dbConnection.then(db => {
      Store.find({userId: req.session.userId})
        .then(stores => {
          stores.map(store => {
            storeIds.push(store._id)
          })

          Product.findById(requestId)
            .then(product => {
              storeIds.map(store_id => {
                if(store_id == product.storeId){
                  Product.findByIdAndDelete(requestId)
                  .then(err => {
                    console.log("Error during deleting the product. ", err)
                  })
                  res.sendStatus(200)
                } 
              })
            })
            .catch(err => {
              console.log("Could not find product")
              res.sendStatus(404)
            })
        })
        .catch(err => {
          console.log("Could not find store")
          res.sendStatus(404)
        })
    })
  } else {
    console.log("User is not connected.");
    res.sendStatus(401);
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
