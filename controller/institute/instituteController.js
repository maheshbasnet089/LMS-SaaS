const generateInstituteNumber = require("../../services/generateOrgNumber")
const db = require("../../model/index")
const { QueryTypes } = require("sequelize")
const {sequelize} = db


exports.createInsitute = async(req,res)=>{
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



}