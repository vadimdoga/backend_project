const fs = require('fs')

function readPasswordFile(path, password){
  const commonPasswords = fs.readFileSync(path, 'utf8')
  if(password === commonPasswords){
    console.log("Password in common passwords!")
    return false
  } else {
    console.log("Password not in common passwords!")
    return true
  }
  
}
function verifyPasswordStrength(password){
  let i = 0
  while(i < password.length){
    ch = password.charAt(i)
    if(ch === ch.toUpperCase()){
      verification = readPasswordFile('10k-passwords.txt', password)
      if(verification){
        return true
      } else {
        return false
      }
    }
    i = i + 1
  }
}

module.exports = verifyPasswordStrength