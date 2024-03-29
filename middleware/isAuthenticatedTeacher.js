const jwt = require('jsonwebtoken')
const {promisify} = require("util")
const { users, sequelize } = require('../model')
const { QueryTypes } = require('sequelize')

exports.isAuthenticatedTeacher =  async(req,res,next)=>{
    const token = req.headers.authorization 
    console.log(token)
    if(!token || token === "" || token === undefined || token === null){
        return res.status(400).json({
            message : "Please provide token"
        })
    }

    const result =  await promisify(jwt.verify)(token,process.env.SECRET_KEY)
    console.log(result)
    const [userData] = await sequelize.query(`SELECT * FROM teachers_${result.instituteNumber} WHERE id=?`,{
        replacements : [result.id],
        type : QueryTypes.SELECT
    })

    if(!userData){
        return res.status(404).json({
            message : "Invalid token"
        })
    }
    req.teacherId = userData.id
    req.instituteNumber = result.instituteNumber
    next()
}