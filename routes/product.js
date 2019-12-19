const Product = require("../model/Product")
const Store = require("../model/Store")
const router = require("express").Router()
const verifyToken = require("./verifyToken")
const {
  createProductValidation,
  editProductValidation
} = require("../validation")

router.get("/", async (req, res) => {
  let productsToSend = []
  const products = await Product.find({})
  if (products.length === 0) return res.status(404).send("No products!")
  for (let i = 0; i < products.length; i++) {
    const productData = {
      storeName: stores[i].storeName,
      storeAddress: stores[i].storeAddress,
      storeEmail: stores[i].storeEmail
    }
    productsToSend.push(productData)
  }
  res.json(productsToSend)
})

router.post("/", verifyToken, async (req, res) => {
  //if field are right validation
  const { error } = createProductValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  //find store by user id and store name
  const store = await Store.findOne({
    userId: req.user._id,
    storeName: req.body.storeName
  })
  if (!store) return res.status(400).send("Invalid Store Name")
  //set store id in Product
  req.body.storeId = store._id
  const product = new Product(req.body)
  //save product
  try {
    const savedProduct = await product.save()
    res.send(savedProduct)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put("/:id", verifyToken, async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id })
  //if product id is valid
  if (!product) return res.status(400).send("Invalid product id!")
  //if store exists
  const store = await Store.findOne({
    userId: req.user._id,
    storeName: req.body.storeName
  })
  if (!store) return res.status(400).send("Invalid Store Name!")
  //if field are right validation
  const { error } = editProductValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  //if product field data have changed
  if (
    req.body.productCategories === product.productCategories ||
    req.body.productImages === product.productImages ||
    req.body.productDescription === product.productDescription ||
    req.body.productTitle === product.productTitle ||
    req.body.productPrice === product.productPrice ||
    store._id === product.storeId
  )
    return res.status(406).send("No changes occurred!")
  //if changed assign value to each field
  req.body.productCategories
    ? (product.productCategories = req.body.productCategories)
    : null
  req.body.productImages
    ? (product.productImages = req.body.productImages)
    : null
  req.body.productDescription
    ? (product.productDescription = req.body.productDescription)
    : null
  req.body.productTitle ? (product.productTitle = req.body.productTitle) : null
  req.body.productPrice ? (product.productPrice = req.body.productPrice) : null
  req.body.storeName ? (product.storeId = store._id) : null

  try {
    const savedProduct = await product.save()
    res.json(savedProduct)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.delete("/:id", verifyToken, async(req, res) => {
  const product = await Product.findOneAndDelete({_id: req.params.id})
  //if store id is valid
  if(!product) return res.status(400).send("Invalid store id!")

})

module.exports = router
