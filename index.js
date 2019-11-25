const express = require("express");
const app = express();
const session = require("express-session");
const port = 3000;
const bodyParser = require("body-parser");
const cors = require("cors");
//mongo
const dbConnection = require("./dbConnection");
const Store = require("./Schemas/storeSchema");
const Product = require("./Schemas/productSchema");
const Register = require("./Schemas/Auth/registerSchema");
//security
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
    Store.find({ userId: req.session.userId })
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

app.post("/auth/register", (req, res) => {
  if (req.body.email && req.body.username && req.body.password) {
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
        return res.redirect("/");
      }
    });
  }
});

app.post("/profile/update", (req, res) => {
  if (req.session.userId) {
    if (req.body.username || req.body.password) {
      if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
      }
      dbConnection.then(db => {
        Register.findById(req.session.userId)
          .then(user => {
            req.body.username ? (user.username = req.body.username) : null;
            req.body.password ? (user.password = req.body.password) : null;
            console.log(user);
            user.save().then(() => {
              res.json("Profile updated");
            });
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


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
