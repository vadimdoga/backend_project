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

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation