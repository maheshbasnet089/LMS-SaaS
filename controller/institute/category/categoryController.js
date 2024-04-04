const { QueryTypes } = require("sequelize")
const { sequelize } = require("../../../model")

exports.createCategory = async(req,res)=>{
    const {instituteNumber} = req 
    const {name} = req.body 
    if(!name){
        return res.status(400).json({
            message : "Please provide name"
        })
    }
    await sequelize.query(`INSERT INTO courseCategory_${instituteNumber}(name) VALUES(${name})`,{
        type : QueryTypes.INSERT
    })
    res.status(200).json({
        message : "Category added"
    })
}

exports.deleteCategory = async(req,res)=>{
    const { instituteNumber} = req 
    const {id} = req.params 
    await sequelize.query(`DELETE FROM courseCategory_${instituteNumber} WHERE id=${id}`,{
        type : QueryTypes.DELETE
    })
}

exports.getAllCategories = async(req,res)=>{
    const {instituteNumber} = req
    const data = await sequelize.query(`SELECT * FROM courseCategory_${instituteNumber}`,{
        type : QueryTypes.SELECT
    })
    res.status(200).json({
        message : "Category fetched",
        data
    })
}

