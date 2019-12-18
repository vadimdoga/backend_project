const Joi = require("@hapi/joi")

//register validation
const registerValidation = data => {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email()
      .min(6)
      .max(255),
    username: Joi.string()
      .required()
      .min(2)
      .max(255),
    password: Joi.string()
      .required()
      .min(7)
      .max(1024)
  })
  return schema.validate(data)
}
//login validation
const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email()
      .min(6)
      .max(255),
    password: Joi.string()
      .required()
      .min(7)
      .max(1024)
  })
  return schema.validate(data)
}
//create Store validation
const createStoreValidation = data => {
  const schema = Joi.object({
    storeName: Joi.string()
      .required()
      .min(4)
      .max(255),
    storeEmail: Joi.string()
      .email()
      .required()
      .min(6)
      .max(255),
    storeAddress: Joi.string()
      .required()
      .min(6)
      .max(255),
    storeImage: Joi.binary()
  })
  return schema.validate(data)
}
//edit Store validation
const editStoreValidation = data => {
  const schema = Joi.object({
    storeName: Joi.string()
      .min(4)
      .max(255),
    storeEmail: Joi.string()
      .email()
      .min(6)
      .max(255),
    storeAddress: Joi.string()
      .min(6)
      .max(255),
    storeImage: Joi.binary()
  })
  return schema.validate(data)
}


module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.createStoreValidation = createStoreValidation
module.exports.editStoreValidation = editStoreValidation