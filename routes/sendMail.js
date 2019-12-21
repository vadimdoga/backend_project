const nodemailer = require('nodemailer')

const emailConfirm = async(emailTo, token) => {
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
    // html: "<p>To Confirm your account, follow this link: </p><a>http://localhost:4000/user/confirm?token=" + token + "</a>"
    text: "To Confirm your account, follow this link: http://localhost:4000/user/confirm?confirmToken=" + token
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log(error)
  }
}

module.exports.emailConfirm = emailConfirm