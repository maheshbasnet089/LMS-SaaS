const { QueryTypes } = require("sequelize")
const { sequelize } = require("../../model")

exports.createCourseSyllabus = async(req,res)=>{
    
    const {title,description,courseId,videoTitle} = req.body 
    const {teacherId,instituteNumber} = req 
    if(!title || !description || !courseId || !videoTitle ||  !req.file){
        return res.status(400).json({
            message : "Plase provide title,description,courseId,videoTitle,video"
        })
    }
    let videoUrl = req.file.filename 

    const data = await sequelize.query(`INSERT INTO courseSyllabusVideo_${instituteNumber}(videoUrl,videoTitle) VALUES('${videoUrl}','${videoTitle}')`,{
        type : QueryTypes.INSERT
    })
    console.log(data) 
    res.status(200).json({
        message : "Syllabus Created"
    })

}