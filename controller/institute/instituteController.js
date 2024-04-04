const generateInstituteNumber = require("../../services/generateOrgNumber")
const db = require("../../model/index")
const { QueryTypes } = require("sequelize")
const {sequelize} = db


exports.createInsitute = async(req,res,next)=>{
    const {userId} = req
    const {name,email,address,phoneNumber,latitude,longitude} = req.body 
    console.log(req.body)
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
        latitude VARCHAR(255),
        longitude VARCHAR(255),
        phoneNumber VARCHAR(255) NOT NULL,
        vatNo INT,
        panNO INT,
        userId INT REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

    )`,{
        type : QueryTypes.CREATE
    })

    await sequelize.query(`INSERT INTO institute_${instituteNumber}(name,email,address,phoneNumber,vatNo,panNo,userId,latitude,longitude) VALUES(?,?,?,?,?,?,?,?,?)`,{
        type : QueryTypes.INSERT,
        replacements : [name,email,address,phoneNumber,vatNo,panNo,userId,latitude || null,longitude|| null]
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
        status VARCHAR(255) NOT NULL,
        photo VARCHAR(255) NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

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
        email VARCHAR(255) NOT NULL UNIQUE,
        phoneNumber VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        status VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        photo VARCHAR(255) NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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


exports.createCategoryTable = async(req,res,next)=>{
    const {instituteNumber} = req 
    await sequelize.query(`CREATE TABLE courseCategory_${instituteNumber}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255)
    )`,{
        type : QueryTypes.CREATE
    })
    await sequelize.query(`INSERT INTO courseCategory_${instituteNumber}(name) VALUES('Frontend'),('Backend'),('App'),('Web') `,{
        type : QueryTypes.INSERT
    })
    next()
}


exports.createSyllabusTable = async(req,res,next)=>{
    const {instituteNumber} = req 
    await sequelize.query(`CREATE TABLE courseSyllabus_${instituteNumber}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        videoId INT REFERENCES courseSyllabusVideo_${instituteNumber}(id) ON DELETE CASCADE ON UPDATE CASCADE,
        reviewId INT REFERENCES courseSyllabusReview_${instituteNumber}(id) ON DELETE CASCADE ON UPDATE CASCADE,
        qnaId INT REFERENCES courseSyllabusQna_${instituteNumber}(id) ON DELETE CASCADE ON UPDATE CASCADE,
        courseId INT REFERENCES course_${instituteNumber}(id) ON UPDATE CASCADE ON DELETE CASCADE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        teacherId INT REFERENCES teachers_${instituteNumber}(id) ON DELETE CASCADE ON UPDATE CASCADE,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

    )`,{
        type : QueryTypes.CREATE
    })
    next()
}


exports.createSyllabusVideoTable  = async(req,res,next)=>{
    const {instituteNumber} = req 
    await sequelize.query(`CREATE TABLE courseSyllabusVideo_${instituteNumber}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        videoUrl VARCHAR(255) NOT NULL,
        videoTitle VARCHAR(255) NOT NULL
    )`,{
        type : QueryTypes.CREATE
    })
    next()
}

exports.createSyllabusReviewTable = async(req,res,next)=>{
    const {instituteNumber} = req 
    await sequelize.query(`CREATE TABLE courseSyllabusReview_${instituteNumber}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        message TEXT, 
        rating INT NOT NULL
    )`,{
        type : QueryTypes.CREATE
    })
    next()
}

exports.createSyllabusQnaSession = async(req,res,next)=>{
    const {instituteNumber} = req 
    await sequelize.query(`CREATE TABLE courseSyllabusQna_${instituteNumber}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
        question VARCHAR(255) NOT NULL, 
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        studentId INT REFERENCES students_${instituteNumber}(id) ON UPDATE CASCADE ON DELETE CASCADE

    )`,{
        type : QueryTypes.CREATE
    })
    next()
}

exports.courseSyllabusQuestionsAnswerTable = async(req,res,next)=>{
    const {instituteNumber} = req 
    await sequelize.query(`CREATE TABLE courseSyllabusQuestionsAnswer_${instituteNumber}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
        answer VARCHAR(255) NOT NULL, 
        questionId INT REFERENCES courseSyllabusQna_${instituteNumber}(id) ON UPDATE CASCADE ON DELETE CASCADE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        studentId INT REFERENCES students_${instituteNumber}(id) ON UPDATE CASCADE ON DELETE CASCADE,
        teacherId INT REFERENCES teachers_${instituteNumber}(id) ON UPDATE CASCADE ON DELETE CASCADE

    )`,{
        type : QueryTypes.CREATE
    })
    next()
}


exports.createCourseTable = async(req,res,next)=>{
    const {instituteNumber} = req 

    await sequelize.query(`CREATE TABLE course_${instituteNumber}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY , 
        name VARCHAR(255) NOT NULL, 
        description TEXT NOT NULL,
        price INT NOT NULL,
        teacherId INT REFERENCES teachers_${instituteNumber}(id) ON UPDATE CASCADE ON DELETE CASCADE,
        startingDate VARCHAR(255),
        endingDate VARCHAR(255),
        time VARCHAR(255),
        image VARCHAR(255)
    )`,{
        type : QueryTypes.CREATE
    })
    next()
}