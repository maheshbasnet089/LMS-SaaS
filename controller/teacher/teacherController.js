const { QueryTypes } = require("sequelize")
const { sequelize } = require("../../model")
const bcrypt = require('bcrypt')
const jwt =require('jsonwebtoken')

exports.teacherLogin = async(req,res)=>{
    const {email,password,instituteNumber} = req.body 
    if(!email || !password || !instituteNumber){
        return res.status(400).json({
            message : "Please provide email,password,instituteNumber"
        })
    }

    const [teacherData] = await sequelize.query(`SELECT * FROM teachers_${instituteNumber} WHERE email=?`,{
        type : QueryTypes.SELECT,
        replacements : [email]
    })
    if(!teacherData){
        return res.status(401).json({
            message : "Invalid email"
        })
    }
    const isPasswordMatched = bcrypt.compareSync(password,teacherData.password)
    if(!isPasswordMatched){
        return res.status(401).json({
            message : "Password didn't matched"
        })
    }
    await sequelize.query(`UPDATE teachers_${instituteNumber} SET status=? WHERE id=?`,{
        type : QueryTypes.UPDATE,
        replacements : ['online',teacherData.id]
    })
    // token generate 

   const token =  jwt.sign({
        id : teacherData.id, 
        instituteNumber : instituteNumber
    },process.env.JWT_SECRET,{
        expiresIn : "20d"
    })
    res.status(200).json({
        message : "logged in successfully",
        token
    })

}

exports.logOutTeacher = async(req,res)=>{
    const {instituteNumber,teacherId} = req 
    await sequelize.query(`UPDATE teachers_${instituteNumber} SET status=? where id=?`,{
        replacements : ['offline',teacherId],
        type : QueryTypes.UPDATE
    })

    res.status(200).json({
        message : "Teacher updated"
    })

}

exports.changePassword = async(req,res)=>{
    const {instituteNumber,teacherId} = req 
    const {oldPassword,newPassword} = req 
    if(!oldPassword || !newPassword){
        return res.status(400).json({
            message : "Please provide oldPassword,newPassword"
        })
    }
    const [teacherData] = await sequelize.query(`SELECT * FROM teachers_${instituteNumber} WHERE id=?`,{
        replacements : [teacherId],
        type  : QueryTypes.SELECT
    })
    if(!bcrypt.compareSync(oldPassword,teacherData.password)){
        return res.status(401).json({
            message  : "Invalid credentials"
        })
    }
    await sequelize.query(`UPDATE teachers_${instituteNumber} SET password = ?  WHERE id=?`,{
        replacements : [bcrypt.hashSync(newPassword,10),teacherId],
        type : QueryTypes.UPDATE
    })
    res.status(200).json({
        message : "Password updated successfully"
    })
}

exports.getProfile = async(req,res)=>{
    const {instituteNumber,teacherId} = req 
    const [teacherData] = await sequelize.query(`SELECT * FROM teachers_${instituteNumber} WHERE id=?`,{
        replacements : [teacherId],
        type : QueryTypes.SELECT
    })
    res.status(200).json({
        data : [
            {
                name : teacherData.name,
                phoneNumber : teacherData.phoneNumber,
                address : teacherData.address,
                photo : teacherData.photo,
                status : teacherData.status
            }
        ]
    })
}

exports.updateMe = async(req,res)=>{

    const {instituteNumber,teacherId} = req 
    const {name,address,phoneNumber} = req 
    const photo = req?.file?.path 
    const [teacher] = await sequelize.query(`SELECT * FROM teachers_${instituteNumber} WHERE id=?`,{
        type : QueryTypes.SELECT,
        replacements : [teacherId]
    })
    if(!teacher){
        return res.status(404).json({
            message : "no teacher with that id"
        })
    }

    await sequelize.query(`UPDATE teachers_${instituteNumber} SET name=?,phoneNumber=?,address=?,email=?,photo=?`,{
        type : QueryTypes.UPDATE,
        replacements : [
            name || teacher.name,
            phoneNumber || teacher.phoneNumber,
            address || teacher.address, 
            photo || teacher.photo
            
        ]
    })
    res.status(200).json({
        message : "Teacher profile updated"
    })
}