'use strict';
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const cors = require('cors')
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const passwords = require("./.password.js")
const app = express()
//const Secret = passwords.JWT
app.use(cors());
app.use(bodyParser.json());
app.use(express.json())
const generateToken = (user,vaultid) => {
  const expiration = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour expiration
  return jwt.sign({ user,VaultID:vaultid}, 'secret', { expiresIn: expiration });
};
var Encrypt1 = (text,secretKey)=>{
  const data = CryptoJS.AES.encrypt(
    JSON.stringify(text),
    secretKey
  ).toString();
  return data;
}
var Decrypt1 = (text,secretKey)=>{
  const bytes = CryptoJS.AES.decrypt(text, secretKey);
  const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
return data;
}
var encrypt = ((val,ENC_KEY,IV) => {
    let cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
    let encrypted = cipher.update(val, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  });
  var decrypt = ((v,ENC_KEY,IV) => {
    //const IV = val.slice(-16)
    //const v = val.slice(0,(val.length)-16)
    //console.log("v:"+v)
    let cipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
    let encrypted = cipher.update(v, 'base64', 'utf8');
    encrypted += cipher.final('utf8');
    return encrypted;
  });
  function deriveKey(email, salt) {
    return crypto.pbkdf2Sync(email, salt, 100000, 32, 'sha512');
}
function generateSalt() {
    return crypto.randomBytes(32).toString('hex');
}
app.post("/password",(req,res)=>{
  //console.log("registration")
    const {hashedPassword,email} = req.body;
    //console.log("hashed password from form:",hashedPassword)
    const salt = generateSalt();
    
    
    const ENC_KEY = deriveKey(email, salt).toString('hex').slice(0,32);
    //console.log("encryption key generated from user email:",ENC_KEY)
    const IV = crypto.randomBytes(32).toString('hex').slice(0, 16); // set random initialisation vector
    const result =  encrypt(hashedPassword,ENC_KEY,IV);
    //console.log("encrypted hashed password:",result)
    const s = result+IV+salt
    //console.log("the password which will be stored in blockchain:",s)
     //salt = s.slice(-64)
     //console.log("Salt:",salt)
    //IV = s.slice(s.length-80,s.length-64)
    //console.log("IV:",IV)
    const byte = (str) => {
      let size = Buffer.from(str).length;
      return size;
   }
   
    
    res.json({
        encryptedPassword:s
    })

})
app.post("/checkpassword",(req,res)=>{
  //console.log("login authentication")
  const {retrievedpassword,formpassword,email,vaultID} = req.body;
  //console.log("password from form:",formpassword)
  const salt = retrievedpassword.slice(-64)
  //console.log(" retrieved Salt:",salt)
  const IV = retrievedpassword.slice(retrievedpassword.length-80,retrievedpassword.length-64);
  //console.log("retrieved IV:",IV)
  
  const ENC_KEY = deriveKey(email, salt).toString('hex').slice(0,32);
  //console.log("encryption key generated from user email:",ENC_KEY)
  const realRpassword = retrievedpassword.slice(0,retrievedpassword.length-80);
  //console.log("retrieved password:",realRpassword)
  const result =  decrypt(realRpassword,ENC_KEY,IV);
//console.log("Decrypted hashed password:",result)
  const comparePassword = (formpassword, result) =>
  bcrypt.compareSync(formpassword, result);
  //console.log(comparePassword(formpassword,result))
  //console.log("hashed from SC:",result)
 const token = generateToken(email,vaultID);
 res.json({isAuthenticated:comparePassword(formpassword,result),token:token})



})
app.post("/retrievecredentials",(req,res)=>{
  const {Credarr,masterPassword} = req.body;
  const decryptedPass = []
  for(let i=0;i<Credarr.length;i++)
  { const user = Credarr[i].username;
    const name = Credarr[i].name;
   
    const pass = Credarr[i].password;
    for(let i=0;i<user.length;i++)
    {
     let p = pass[i];
      //console.log("p:",p)
      const IV = p.slice(-16);
      //console.log("IV:",IV);
    
    const salt = p.slice(p.length-80,p.length-16);
   //console.log("Salt:",salt);
    const ENC_KEY = deriveKey(masterPassword, salt).toString('hex').slice(0,32);
    //console.log("pass0:",p.slice(0,p.length-80))
    p = p.slice(0,p.length-80)
    const result = decrypt(p,ENC_KEY,IV);
    //console.log("result:",result)
    decryptedPass.push({name:name,username:user[i],password:result});
    }
    
    
    
    
  }
  //console.log(decryptedPass)
  res.json({decryptedPasswords:decryptedPass})
 

})
app.post("/addcredentials",(req,res)=>{
  //console.log("add credentials")
  const {credentialPassword,secretKey,masterpassword} = req.body;
  
  const salt = generateSalt();
  //console.log("Salt:",salt)
  const ENC_KEY = deriveKey(masterpassword, salt).toString('hex').slice(0,32);
  //console.log("ENC KEY:",ENC_KEY)
  const IV = crypto.randomBytes(32).toString('hex').slice(0, 16);
  //console.log("IV:",IV)
  const decrypted = Decrypt1(credentialPassword,secretKey)
  const result = encrypt(decrypted,ENC_KEY,IV)
  //const decrypted = Decrypt1(credentialPassword,secretKey)
  //const ENC_KEY = deriveKey(masterPassword, salt).toString('hex').slice(0,32);
  //console.log(decrypted)

  const f = result+salt+IV;
  res.json({encryptedCredentialPassword:f})
  //console.log("IV from f:"+f.slice(-16))
   //console.log("Salt from f:"+f.slice(f.length-80,f.length-16))


})

app.listen(3007,()=>console.log("Server running"))
