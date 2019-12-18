const Product = require("./schemas/Product");



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