const { users } = require("../../model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.registerUser = async(req,res)=>{
    const {email,username,password} = req.body 
    if(!email || !username || !password){
        return res.status(400).json({
            message : "Please provide email,username,password"
        })
    }
   await users.create({
        email,
        username,
        password : bcrypt.hashSync(password,10)
    })
    res.status(200).json({
        message : "user registered successfully"
    })
}

exports.loginUser = async(req,res)=>{
    const {email,password} = req.body 
    if(!email || !password){
        return res.status(400).json({
            message : "Please provide email,password"
        })
    }
    // check email 
    const [userData] = await users.findAll({
        where : {
            email
        }
    })
    if(userData){
        // check password too 
      const isPasswordMatched =  bcrypt.compareSync(password,userData.password)
      if(!isPasswordMatched){
        return res.status(404).json({
            message : "Invalid Password"
        })
      }
      // token generation
      const token = jwt.sign({id : userData.id},process.env.SECRET_KEY,{
        expiresIn : process.env.EXPIRES_IN
      })
      res.status(200).json({
        message : "user logged successfully",
        data : token
      })
    }else{
        res.status(404).json({
            message : "No user with that email"
        })
    }
}