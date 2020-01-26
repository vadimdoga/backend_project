const User = require("../model/User")
const router = require("express").Router()
const verifyToken = require("./verifyToken")
const bcrypt = require("bcrypt")
const { editProfileValidation } = require("../validation")
const verifyPasswordStrength = require("./verifyPasswordStrength")

router.put("/edit", verifyToken, async (req, res) => {
  if (!req.body.username && !req.body.oldPassword)
  return res.status(400).send("Invalid fields!")

  const { error } = editProfileValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const userExist = await User.findOne({ _id: req.user.id })
  if (!userExist) return res.status(400).send("No such user!")

  if (req.body.username) {

    //verify for password weakness
    if (!verifyPasswordStrength(req.body.newPassword))
      return res.status(400).send("Weak Password!")
    if (userExist.username.toLowerCase() === req.body.username.toLowerCase())
      return res.status(400).send("Type another username!")
    //change username
    userExist.username = req.body.username
  }
  if (req.body.oldPassword && req.body.newPassword) {

    //verify old password with current in the db
    const verifyOldPassword = await bcrypt.compare(
      req.body.oldPassword,
      userExist.password
    )
    if (!verifyOldPassword) return res.status(400).send("Invalid Password!")
    //verify old password with new password
    const verifyNewPassword = req.body.oldPassword === req.body.newPassword
    if (verifyNewPassword) return res.status(400).send("Passwords match!")

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashNewPassword = await bcrypt.hash(req.body.newPassword, salt)
    //change password
    userExist.password = hashNewPassword
  }
  //save user to db
  try {

    const savedUser = await userExist.save()

    res.send(savedUser)
  } catch (error) {
    res.status(400).send(error)
  }
})

module.exports = router
