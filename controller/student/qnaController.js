const { QueryTypes } = require("sequelize")
const { sequelize } = require("../../model/")

exports.askQuestion = async(req,res)=>{
    const {question,syllabusId} = req 
    const {studentId,instituteNumber} = req 
    if(!question || !syllabusId){
        return res.status(400).json({
            message : "please provide question,syllabusId"
        })
    }
    await sequelize.query(`INSERT INTO courseSyllabusQna_${instituteNumber}(question,studentId,syllabusId) VALUES(?,?,?)`,{
        type : QueryTypes.INSERT,
        replacements : [question,studentId,syllabusId]
    })
    res.status(200).json({
        message : "Question asked successfully"
    })
}

exports.answerQuestion = async(req,res)=>{
    const {answer,questionId,syllabusId} = req.body 
    const {studentId,instituteNumber} = req 

    if(!answer || !questionId || !syllabusId){
        return res.status(200).json({
            message : "Please provide answer,questionId,studentId,syllabusId"
        })
    }
    await sequelize.query(`INSERT INTO courseSyllabusQuestionsAnswer_${instituteNumber}(answer,questionId,syllabusId,studentId,teacherId) VALUES(?,?,?,?,?)`,{
        type : QueryTypes.INSERT, 
        replacements : [answer,questionId,syllabusId,studentId,null]
    })
    res.status(200).json({
        message : 'Answered successfully'
    })
}

exports.deleteMyQuestion = async(req,res)=>{
    const {questionId} = req.params 
    const [data]  = await sequelize.query(`SELECT * FROM courseSyllabusQna_${instituteNumber} WHERE id=${questionId}`,{
        type   : QueryTypes.SELECT
    }) 
    if(!data || data.studentId !== req.studentId){
        return res.status(400).json({
            message : "No data or you don't have permission"
        })
    }else{
        await sequelize.query(`DELETE FROM courseSyllabusQna_${instituteNumber} WHERE id=${questionId}`,{
            type : QueryTypes.DELETE
        })
        res.status(200).json({
            message : "Question Deleted successfully"
        })
    }
}

exports.deleteMyAnswer = async(req,res)=>{
    
}