const { QueryTypes } = require("sequelize")
const { sequelize } = require("../../../model")
const bcrypt = require('bcrypt')
const sendEmail = require("../../../services/sendEmail")

exports.createStudent = async(req,res)=>{
    const {instituteNumber} = req 
    const {email,name,phoneNumber,status} = req.body 
    if(!email || !name || !phoneNumber ){
        return res.status(400).json({
            message : "Please provide email,name,phoneNumber,status"
        })
    } 
    const randomPassword = "PASS_" + Math.floor(100000 + Math.random() * 900000)
    let fileName = req.file ? req.file.filename : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWzZEiLVtXjF0-5jj1XlnXotaSn-5D2GoV5B0qa55yqmFHbWbncqWLrKRspJ5l7KYRPg4&usqp=CAU"
    await sequelize.query(`INSERT INTO students_${instituteNumber}(email,name,phoneNumber,status,photo,password) VALUES(?,?,?,?,?,?)`,{
        type : QueryTypes.INSERT, 
        replacements : [email,name,phoneNumber,status || "offline",fileName , bcrypt.hashSync(randomPassword)]
    })
     // send mail to the student with password 
     await sendEmail({
        to : email,
        text : `You have been registered in lms saas platform as a student. To login to your portal, these are the credentials\n email : ${email}\n password : ${randomPassword}\n instituteNumber:${instituteNumber}`,
        subject : "Registration on LMS SaaS as a student"
    })
    res.status(200).json({
        message : 'student created successfully'
    })
}




exports.deleteStudent = async(req,res)=>{
    const {instituteNumber} = req 
    const {studentId} = req.params

    // check if student exist 
    const [data] = await sequelize.query(`SELECT * FROM students_${instituteNumber} WHERE id=?`,{
        type  : QueryTypes.SELECT,
        replacements : [studentId]
    })
    if(!data){
        return res.status(404).json({
            message : "No student found with that id"
        })
    }
    await sequelize.query(`DELETE FROM students_${instituteNumber} WHERE id=?`,{
        type : QueryTypes.DELETE,
        replacements : [studentId]
    })

    res.status(200).json({
        message : "Student deleted successfully"
    })

}

exports.getStudents = async(req,res)=>{
    const {instituteNumber} = req 
    const data = await sequelize.query(`SELECT * FROM students_${instituteNumber}`,{
        type : QueryTypes.SELECT
    })
    if(data.length === 0 ){
        res.status(404).json({
            message : "No student exists"
        })
    }else{
        res.status(200).json({
            message : "Student fetched successfully",
            data 
        })
    }
}

exports.updateStudent = async(req,res)=>{
    const {instituteNumber} = req 
    
    const {name,email,phoneNumber,address,password} = req.body 
    let photo 
    if(req.file){
        photo = req.file.path 
    }
    const [student] = await sequelize.query(`SELECT * FROM students_${instituteNumber} WHERE email=?`,{
        type : QueryTypes.SELECT,
        replacements : [email]
    })
    if(!student){
        return res.status(404).json({
            message : "no student with that id"
        })
    }

    await sequelize.query(`UPDATE students_${instituteNumber} SET name=?,phoneNumber=?,address=?,email=?,photo=?,password=?`,{
        type : QueryTypes.UPDATE,
        replacements : [
            name || student.name,
            phoneNumber || student.phoneNumber,
            address || student.address, 
            photo || student.photo,
            password ? bcrypt.hashSync(password,10) : student.password
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
        message : "Student profile updated"
    })
}