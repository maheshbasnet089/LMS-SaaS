const { QueryTypes } = require("sequelize")
const { sequelize } = require("../../model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.loginTeacher = async(req,res)=>{
    const {email,password,instituteNumber} = req.body 
    if(!email || !password){
        return res.status(400).json({
            message : "please provide email,password"
        })
    }
   const [data] =  await sequelize.query(`SELECT * FROM teachers_$${instituteNumber} WHERE email=${email}`,{
        type : QueryTypes.SELECT
    })

    if(!data){
        return res.status(404).json({
            message : "No user witth that email"
        })
    }
   const isMatched =  bcrypt.compareSync(password,data.password)
   if(!isMatched) return res.status(403).json({
    mesage : "Invalid Password"
   })
  const token =  jwt.sign({id:data.id},process.env.JWT_SECRET_TEACHER,{
    expiresIn : "30d"
   })
   res.status(200).json({
    message : "Logged in successfully",
    data : token
   })
}