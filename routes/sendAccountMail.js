const nodemailer = require('nodemailer')

const accountMailConfirm = async(emailTo, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fakeetsy1212@gmail.com',
      pass: 'radydevuq'
    }
  })
  
  const mailOptions = {
    from: 'Fake Etsy Store',
    to: emailTo,
    subject: 'Account Confirmation',
    text: "To Confirm your account, follow this link: https://localhost:4000/user/confirm?confirmToken=" + token
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log(error)
  }
}

module.exports.accountMailConfirm = accountMailConfirm