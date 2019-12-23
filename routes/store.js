const router = require("express").Router()
const Store = require("../model/Store")
const verifyToken = require("./verifyToken")
const { createStoreValidation, editStoreValidation } = require("../validation")

router.get("/", async (req, res) => {
  let storesToSend = []
  const stores = await Store.find({})
  if (stores.length === 0) return res.status(404).send("No Stores!");
  for (let i = 0; i < stores.length; i++) {
    const storeData = {
      "storeName": stores[i].storeName,
      "storeAddress": stores[i].storeAddress,
      "storeEmail": stores[i].storeEmail,
      "storeImage": stores[i].storeImage
    }
    storesToSend.push(storeData)
  }
  res.json(storesToSend)
})

router.post("/", verifyToken, async(req, res) => {
  //data validation
  const { error } = createStoreValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  //verify for coincidence storeName
  const storeExist = await Store.findOne({storeName: req.body.storeName})
  if (storeExist) return res.status(400).send("Store already exists!")
  
  //assign id 
  req.body.userId = req.user._id

  //save store
  const store = Store(req.body)
  try {
    const savedStore = await store.save()
    res.send(savedStore);
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put("/:id", verifyToken, async(req, res) => {
  const store = await Store.findOne({ _id: req.params.id })
  //if store id is valid
  if(!store) return res.status(400).send("Invalid store id!")
  //if field are right validation
  const { error } = editStoreValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  //if store field data have changed
  if (
    req.body.storeName === store.storeName ||
    req.body.storeEmail === store.storeEmail ||
    req.body.storeAddress === store.storeAddress 
  ) return res.status(406).send("No changes occurred!")
  //if changed assign value to each field
  req.body.storeName 
    ? (store.storeName = req.body.storeName) 
    : null
  req.body.storeEmail
    ? (store.storeEmail = req.body.storeEmail)
    : null
  req.body.storeAddress
    ? (store.storeAddress = req.body.storeAddress)
    : null
  req.body.storeImage
    ? (store.storeImage = req.body.storeImage)
    : null

  try {
    const savedStore = await store.save()
      res.json(savedStore);
  } catch (error) {
    res.status(400).send(error)
  }
})

router.delete("/:id", verifyToken, async(req, res) => {
  const store = await Store.findOneAndDelete({_id: req.params.id})
  //if store id is valid
  if(!store) return res.status(400).send("Invalid store id!")

})

module.exports = router
