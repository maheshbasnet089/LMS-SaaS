const { QueryTypes } = require("sequelize")
const { sequelize } = require("../../../model")
const sendEmail = require("../../../services/sendEmail")
const bcrypt = require('bcrypt')

exports.createTeacher = async(req,res)=>{
    const {instituteNumber} = req 
    const {name,email,phoneNumber,address} = req.body
    let photo;
    if(req.file){
        photo = req.file.path
    }else{
        photo = ""
    }
    if(!name || !email || !phoneNumber || !address ){
        res.status(400).json({
            message : "Please provide name,email,phoneNumber,address"
        })
    }
    // checking email 
    const [teacher] = await sequelize.query(`SELECT * FROM teachers_${instituteNumber} WHERE email=?`,{
        type : QueryTypes.SELECT,
        replacements  : [email]
    })
    if(teacher){
        return res.status(400).json({
            message : "Teacher with that email already exists"
        })
    }
    const randomPassword = "PASS_" + Math.floor(100000 + Math.random() * 900000)
    await sequelize.query(`INSERT INTO teachers_${instituteNumber}(name,email,phoneNumber,address,status,password,photo) VALUES(?,?,?,?,?,?,?)`,{
        type : QueryTypes.INSERT,
        replacements : [
            name,
            email,
            phoneNumber,
            address,
            'offline',
            bcrypt.hashSync(randomPassword,8),
            photo
        ]   
    })
    // send mail to the teacher with password 
    await sendEmail({
        to : email,
        text : `You have been registered in lms saas platform as a teacher. To login to your portal, these are the credentials\n email : ${email}\n password : ${randomPassword}\n instituteNumber:${instituteNumber}`,
        subject : "Registration on LMS SaaS as a Teacher"
    })
    res.status(200).json({
        message : 'Teacher created successfully'
    })
}


exports.deleteTeacher = async(req,res)=>{
    const {instituteNumber} = req 
    const {teacherId} = req.params

    // check if teacher exist 
    const [data] = await sequelize.query(`SELECT * FROM teachers_${instituteNumber} WHERE id=?`,{
        type  : QueryTypes.SELECT,
        replacements : [teacherId]
    })
    if(!data){
        return res.status(404).json({
            message : "No teacher found with that id"
        })
    }
    await sequelize.query(`DELETE FROM teachers_${instituteNumber} WHERE id=?`,{
        type : QueryTypes.DELETE,
        replacements : [teacherId]
    })

    res.status(200).json({
        message : "Teacher deleted successfully"
    })

}

exports.getTeachers = async(req,res)=>{
    const {instituteNumber} = req 
    const data = await sequelize.query(`SELECT * FROM teachers_${instituteNumber}`,{
        type : QueryTypes.SELECT
    })
    if(data.length === 0 ){
        res.status(404).json({
            message : "No teacher exists"
        })
    }else{
        res.status(200).json({
            message : "Teacher fetched successfully",
            data 
        })
    }
}

exports.updateTeacher = async(req,res)=>{
    const {instituteNumber} = req 
    const {id:teahcerId} = req.params
    const {name,email,phoneNumber,address,password} = req.body 
    let photo 
    if(req.file){
        photo = req.file.path 
    }
    const [teacher] = await sequelize.query(`SELECT * FROM teachers_${instituteNumber} WHERE email=?`,{
        type : QueryTypes.SELECT,
        replacements : [email]
    })
    if(!teacher){
        return res.status(404).json({
            message : "no teacher with that id"
        })
    }

    await sequelize.query(`UPDATE teachers_${instituteNumber} SET name=?,phoneNumber=?,address=?,email=?,photo=?,password=?`,{
        type : QueryTypes.UPDATE,
        replacements : [
            name || teacher.name,
            phoneNumber || teacher.phoneNumber,
            address || teacher.address, 
            photo || teacher.photo,
            password ? bcrypt.hashSync(password,10) : teacher.password
        ]
    })
    if(name || address || phoneNumber || email){
        await sendEmail({
            subject : "Your profile has been updated",
            text : `Your profile has been updated to ${name},${phoneNumber},${password},${email}`,
            to : email 
        })
    }
    res.status(200).json({
        message : "Teacher profile updated"
    })
}