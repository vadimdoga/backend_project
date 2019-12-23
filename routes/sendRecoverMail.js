const nodemailer = require('nodemailer')

const recoverMailConfirm = async(emailTo, token) => {
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
    subject: 'Recover Password',
    text: "To recover your Password, follow this link: http://localhost:4000/user/recover/password?confirmToken=" + token
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log(error)
  }
}

module.exports.recoverMailConfirm = recoverMailConfirm