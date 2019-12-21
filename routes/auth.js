const router = require("express").Router()
const bcrypt = require("bcrypt")
const User = require("../model/User")
const jwt = require("jsonwebtoken")
const verifyToken = require("./verifyToken")
const verifyPasswordStrength = require("./verifyPasswordStrength")
const { registerValidation, loginValidation } = require("../validation")
const { emailConfirm } = require("./sendMail")

router.post("/register", async (req, res) => {
  //data validation
  const { error } = registerValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  //verify for password weakness
  if (!verifyPasswordStrength(req.body.password))
    return res.status(400).send("Weak Password!")
  //verify for email coincidence
  const emailExist = await User.findOne({ email: req.body.email })
  if (emailExist) return res.status(400).send("Email already exists!")
  //hash password
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(req.body.password, salt)

  //temporary token assign
  const temporaryToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET_EMAIL, {
    expiresIn: "1h"
  })

  const user = User({
    email: req.body.email,
    username: req.body.username,
    password: hashPassword
  })

  try {
    const registeredUser = await user.save()
    emailConfirm(req.body.email, temporaryToken)
    res.send(registeredUser)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post("/login", async (req, res) => {
  //todo: verify if account active
  //data validation
  const { error } = loginValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  //find email
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send("Invalid Email!")

  const verifyPassword = await bcrypt.compare(req.body.password, user.password)
  if (!verifyPassword) return res.status(400).send("Invalid Password!")

  //create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "1d"
  })
  res.header("auth-token", token)

  res.send("Logged in!")
})

router.get("/logout", verifyToken, (req, res) => {
  res.removeHeader("auth-token")
  res.redirect("/")
})

router.get('/confirm', async(req, res) => {
  const token = req.query.confirmToken
  if(!token) return res.status(401).send('No Token!')
  //verify token
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET_EMAIL)
    req.user = verified
  } catch (err) {
    res.status(400).send('Invalid Token!')
  }
  //find user and make account active
  const userExist = await User.findOne({_id: req.user})
  userExist.active = true

  try {
    await userExist.save()
    res.send("Account Confirmed Successfuly!");
  } catch (error) {
    res.status(400).send(error)
  }
});
module.exports = router
