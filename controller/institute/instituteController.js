const generateInstituteNumber = require("../../services/generateOrgNumber")
const db = require("../../model/index")
const { QueryTypes } = require("sequelize")
const {sequelize} = db


exports.createInsitute = async(req,res,next)=>{
    const {userId} = req
    const {name,email,address,phoneNumber} = req.body 
    const vatNo = req.body.vatNo || null 
    const panNo = req.body.panNo | null
    if(!name || !email || !address || !phoneNumber){
        return res.status(400).json({
            message : "Please provide name,email,address,phoneNumber"
        })
    }
    const instituteNumber = generateInstituteNumber()
    await sequelize.query(`CREATE TABLE IF NOT EXISTS institute_${instituteNumber} (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL, 
        address VARCHAR(255) NOT NULL,
        phoneNumber VARCHAR(255) NOT NULL,
        vatNo INT,
        panNO INT,
        userId INT REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE

    )`,{
        type : QueryTypes.CREATE
    })

    await sequelize.query(`INSERT INTO institute_${instituteNumber}(name,email,address,phoneNumber,vatNo,panNo,userId) VALUES(?,?,?,?,?,?,?)`,{
        type : QueryTypes.INSERT,
        replacements : [name,email,address,phoneNumber,vatNo,panNo,userId]
    })

    req.instituteNumber = instituteNumber
    next()

}

exports.createUsersInstitutes = async(req,res,next)=>{
    const {userId} = req 
    const {instituteNumber} = req

    await sequelize.query(`CREATE TABLE IF NOT EXISTS userInstitutes_${userId}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
        userId INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
        instituteNumber VARCHAR(255) NOT NULL REFERENCES institute_${instituteNumber}(id) ON UPDATE CASCADE ON DELETE CASCADE
    )`,
    {
        type : QueryTypes.CREATE
    })

    await sequelize.query(`INSERT INTO userInstitutes_${userId}(userId,instituteNumber) VALUES(?,?)`,{
        type : QueryTypes.INSERT,
        replacements : [userId,instituteNumber]
    })

    next()
}

exports.createStudentTable = async(req,res,next)=>{
    const {instituteNumber} = req 
    await sequelize.query(`CREATE TABLE IF NOT EXISTS students_${instituteNumber}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phoneNumber VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        status VARCHAR(255) NOT NULL
    )`,{
        type : QueryTypes.CREATE
    })
    next()
}

exports.createTeacherTable = async (req,res,next)=>{
    const {instituteNumber} = req 
    await sequelize.query(`CREATE TABLE IF NOT EXISTS teachers_${instituteNumber}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phoneNumber VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        status VARCHAR(255) NOT NULL
    )`,{
        type : QueryTypes.CREATE
    })
next()
}

exports.setCurrentOrganizationNumber = async(req,res)=>{
    const {userId} = req 
    const {instituteNumber} = req
    const userData = await db.users.findByPk(userId)
    userData.currentInstituteNumber = instituteNumber
    await userData.save()
    res.status(200).json({
        message : "Institute created successfully",
        instituteNumber
    })
}