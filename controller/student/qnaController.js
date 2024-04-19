const { QueryTypes } = require("sequelize")
const { sequelize } = require("../../model/")

exports.askQuestion = async(req,res)=>{
    const {question,syllabusId} = req.body 
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


exports.getQuestions = async(req,res)=>{
    const {syllabusId} = req.params
    const {instituteNumber} = req 
    if(!syllabusId){
        return res.status(400).json({
            message : 'Please provide syllabusId'
        })
    }
    const data = await sequelize.query(`SELECT * FROM courseSyllabusQna_${instituteNumber} JOIN students_${instituteNumber} ON courseSyllabusQna_${instituteNumber}.studentId = students_${instituteNumber}.id WHERE courseSyllabusQna_${instituteNumber}.syllabusId=?`,{
        type : QueryTypes.SELECT,
        replacements : [syllabusId]
    })
    res.status(200).json({
        message : "Questions fetched successfully",
        data
    })
}

exports.getAnswers = async(req,res)=>{
    const {questionId} = req.params 
    const {instituteNumber} = req 
    if(!questionId){
        return res.status(400).json({
            message : 'Please provide questionId'
        })
    }
    const data = await sequelize.query(`SELECT * FROM courseSyllabusQuestionsAnswer_${instituteNumber} JOIN courseSyllabusQna_${instituteNumber} ON courseSyllabusQuestionsAnswer_${instituteNumber}.questionId = courseSyllabusQna_${instituteNumber}.id LEFT JOIN students_${instituteNumber} ON courseSyllabusQuestionsAnswer_${instituteNumber}.studentId = students_${instituteNumber}.id LEFT JOIN teachers_${instituteNumber} ON courseSyllabusQuestionsAnswer_${instituteNumber}.studentId = teachers_${instituteNumber}.id WHERE courseSyllabusQuestionsAnswer_${instituteNumber}.questionId=?`,{
        type : QueryTypes.SELECT,
        replacements : [questionId]
    })
    res.status(200).json({
        message : "Questions fetched successfully",
        data
    })
}

exports.answerQuestion = async(req,res)=>{
    const {questionId} = req.params
    const {answer,syllabusId} = req.body 
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
    const {answerId} = req.params 
    const {studentId,instituteNumber} = req

    if(!answerId){
        return res.status(400).json({
            message : "Please provide answerId"
        })
    }
   const data =  await sequelize.query(`SELECT * FROM courseSyllabusQuestionsAnswer_${instituteNumber} WHERE answerId=? AND studentId=?`,{
        type : QueryTypes.SELECT, 
        replacements : [answerId,studentId]
    })
    if(data.length === 0 ){
        return res.status(404).json({
            message : "You don't have that answerId answer"
        })
    }
    await sequelize.query(`DELETE FROM courseSyllabusQuestionsAnswer_${instituteNumber} WHERE answerId=? `,{
        type : QueryTypes.DELETE,
        replacements : [answerId]
    })
    res.status(200).json({
        message : "Answer deleted successfully"
    })
}
exports.updateAnswer = async (req,res)=>{
    const {answer,questionId} = req.body 
    const {answerId} = req.params 
    const {instituteNumber} = req

    await sequelize.query(`UPDATE courseSyllabusQuestionsAnswer_${instituteNumber} SET answer=? WHERE answerId=? AND questionId=?`,{
        type : QueryTypes.UPDATE,
        replacements : [answer,answerId,questionId]
    })
    res.status(200).json({
        message : "answer updated successfully"
    })

}