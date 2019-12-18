const Store = require("./schemas/Store");



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

