const { QueryTypes } = require("sequelize")
const { sequelize } = require("../../../model")
const sendEmail = require("../../../services/sendEmail")

exports.createCourse = async(req,res)=>{
    const {instituteNumber} = req 
    const {name,price,startingDate,endingDate,description,teacherId,time} = req.body 
    console.log(req.body)
    if(!name || !price || !startingDate || !endingDate || !description || !teacherId || !time){
        return res.status(400).json({
            message : "Please provide name,price,startingDate,endingDate,description,teacherId,time"
        })
    }
    let imageUrl 
    if(req.file){
        imageUrl = req.file.filename
    }else{
        imageUrl = "https://res.cloudinary.com/iwh/image/upload/q_auto,g_center/w_1024,h_768,c_lpad/assets/1/7/DEFAULT-Training-course.jpg"
    }

    // check if teacher exist or not
   const [data] =  await sequelize.query(`SELECT * FROM teachers_${instituteNumber} WHERE id=${teacherId}`,{
    type : QueryTypes.SELECT 
   })

   if(!data) return res.status(400).json({message:"No teacher with that id"})

    await sequelize.query(`INSERT INTO course_${instituteNumber}(name,price,startingDate,endingDate,description,teacherId,time,image) VALUES('${name}',${price},'${startingDate}','${endingDate}','${description}',${teacherId},'${time}','${imageUrl}')`,{
        type : QueryTypes.INSERT,
        // replacement : [
            
        //     name,parseInt(price),startingDate,endingDate,description,parseInt(teacherId),time,imageUrl
        // ]
    })

    // send mail to notify teacher about course addition
    await sendEmail({
        to:data.email, 
        subject : "New course access given to you",
        text :  `${name} course assigned to you.Please free to check the site and add the syllabus`
    })

    res.status(200).json({
        message : "Course added successfully"
    })
}

exports.deleteCourse = async(req,res)=>{
    const {id} = req.params 
    const {instituteNumber} = req
    await sequelize.query(`DELETE FROM course_${instituteNumber} WHERE id=${id}`,{
        type : QueryTypes.DELETE
    })

    const data = await sequelize.query(`SELECT * FROM courseSyllabus_${instituteNumber} WHERE courseId=${id}`,{
        type : QueryTypes.SELECT
    })

    for(let i = 0 ; i < data.length;i++){
        await sequelize.query(`DELETE FROM courseSyllabusReview_${instituteNumber} WHERE id=${data[i].reviewId}`,{
            type : QueryTypes.DELETE
        })
        await sequelize.query(`DELETE FROM courseSyllabusQna_${instituteNumber} WHERE id=${data[i].qnaId}`,{
            type : QueryTypes.DELETE
        })
    }


    await sequelize.query(`DELETE FROM courseSyllabus_${instituteNumber} WHERE courseId=${id}`,{
        type : QueryTypes.DELETE
    })

    res.status(200).json({
        message : "Course deleted successfully"
    })
}

exports.getAllCourses = async(req,res)=>{
    const {instituteNumber} =req 
    const data = await sequelize.query(`SELECT *,teachers_${instituteNumber}.name,course_${instituteNumber}.name AS courseName,course_${instituteNumber}.id AS courseId FROM course_${instituteNumber} JOIN teachers_${instituteNumber} ON course_${instituteNumber}.teacherId = teachers_${instituteNumber}.id `,{
        type : QueryTypes.SELECT
    })
    res.status(200).json({
        message : "Courses fetched",
        data
    })
}


exports.getSingleCourse = async(req,res)=>{
    const {instituteNumber} = req 
    const {id} = req.params
    let data
    data = await sequelize.query(`SELECT * FROM courseSyllabus_${instituteNumber} cs JOIN course_${instituteNumber} c ON cs.courseId = c.id JOIN courseSyllabusReview_${instituteNumber} cr ON cs.reviewId = cr.id JOIN courseSyllabusQna_${instituteNumber} qi ON cs.qnaId = qi.id JOIN courseSyllabusVideo_${instituteNumber} vi ON cs.videoId = vi.id JOIN teachers_${instituteNumber} ON cs.teacherId = teachers_${instituteNumber}.id WHERE cs.courseId = ${id}`,{
        type : QueryTypes.SELECT
    }) 
    if(data.length === 0){
       data =  await sequelize.query(`SELECT *,teachers_${instituteNumber}.name FROM course_${instituteNumber} JOIN teachers_${instituteNumber} ON course_${instituteNumber}.teacherId = teachers_${instituteNumber}.id `,{
        type : QueryTypes.SELECT
    })
    }
    res.status(200).json({
        message : "Single Course Fetched",
        data
    })
}