const jwt = require('jsonwebtoken')
const {promisify} = require("util")
const { users, sequelize } = require('../model')
const { QueryTypes } = require('sequelize')

exports.isAuthenticatedStudent =  async(req,res,next)=>{
    const token = req.headers.authorization 

    if(!token || token === "" || token === undefined || token === null){
        return res.status(400).json({
            message : "Please provide token"
        })
    }

    const result =  await promisify(jwt.verify)(token,process.env.JWT_SECRET_STUDENT)

    const [userData] = await sequelize.query(`SELECT * FROM students_${result.instituteNumber} WHERE id=?`,{
        replacements : [result.id],
        type : QueryTypes.SELECT
    })

    if(!userData){
        return res.status(404).json({
            message : "Invalid token"
        })
    }
    req.studentId = userData.id
    req.instituteNumber = result.instituteNumber
    next()
}