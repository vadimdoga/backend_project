const nodemailer = require('nodemailer')

const emailConfirm = async(emailTo) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fakeetsy1212@gmail.com',
      pass: 'radydevuq'
    }
  })
  
  const mailOptions = {
    from: 'fakeetsy1212@gmail.com',
    to: emailTo,
    subject: 'Account Confirmation',
    text: 'hello friend',
    html: '<p>Hello world</p>'
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log(error)
  }
}

module.exports.emailConfirm = emailConfirm