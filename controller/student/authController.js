exports.studentLogin = async(req,res)=>{
    const {email,password,instituteNumber} = req.body 
    if(!email || !password || !instituteNumber){
        return res.status(400).json({
            message : "Please provide email,password,instituteNumber"
        })
    }

    const [studentData] = await sequelize.query(`SELECT * FROM students_${instituteNumber} WHERE email=?`,{
        type : QueryTypes.SELECT,
        replacements : [email]
    })
    if(!studentData){
        return res.status(401).json({
            message : "Invalid email"
        })
    }
    const isPasswordMatched = bcrypt.compareSync(password,studentData.password)
    if(!isPasswordMatched){
        return res.status(401).json({
            message : "Password didn't matched"
        })
    }
    await sequelize.query(`UPDATE students_${instituteNumber} SET status=? WHERE id=?`,{
        type : QueryTypes.UPDATE,
        replacements : ['online',studentData.id]
    })
    // token generate 

   const token =  jwt.sign({
        id : studentData.id, 
        instituteNumber : instituteNumber
    },process.env.JWT_SECRET_STUDENT,{
        expiresIn : "20d"
    })
    res.status(200).json({
        message : "logged in successfully",
        token
    })

}

exports.logOutStudent = async(req,res)=>{
    const {instituteNumber,studentId} = req 
    await sequelize.query(`UPDATE students_${instituteNumber} SET status=? where id=?`,{
        replacements : ['offline',studentId],
        type : QueryTypes.UPDATE
    })

    res.status(200).json({
        message : "Student updated"
    })

}

exports.changePassword = async(req,res)=>{
    const {instituteNumber,studentId} = req 
    const {oldPassword,newPassword} = req 
    if(!oldPassword || !newPassword){
        return res.status(400).json({
            message : "Please provide oldPassword,newPassword"
        })
    }
    const [studentData] = await sequelize.query(`SELECT * FROM students_${instituteNumber} WHERE id=?`,{
        replacements : [studentId],
        type  : QueryTypes.SELECT
    })
    if(!bcrypt.compareSync(oldPassword,studentData.password)){
        return res.status(401).json({
            message  : "Invalid credentials"
        })
    }
    await sequelize.query(`UPDATE students_${instituteNumber} SET password = ?  WHERE id=?`,{
        replacements : [bcrypt.hashSync(newPassword,10),studentId],
        type : QueryTypes.UPDATE
    })
    res.status(200).json({
        message : "Password updated successfully"
    })
}

exports.getProfile = async(req,res)=>{
    const {instituteNumber,studentId} = req 
    const [studentData] = await sequelize.query(`SELECT * FROM students_${instituteNumber} WHERE id=?`,{
        replacements : [studentId],
        type : QueryTypes.SELECT
    })
    res.status(200).json({
        data : [
            {
                name : studentData.name,
                phoneNumber : studentData.phoneNumber,
                address : studentData.address,
                photo : studentData.photo,
                status : studentData.status
            }
        ]
    })
}

exports.updateMe = async(req,res)=>{

    const {instituteNumber,studentId} = req 
    const {name,address,phoneNumber} = req 
    const photo = req?.file?.path 
    const [student] = await sequelize.query(`SELECT * FROM students_${instituteNumber} WHERE id=?`,{
        type : QueryTypes.SELECT,
        replacements : [studentId]
    })
    if(!student){
        return res.status(404).json({
            message : "no student with that id"
        })
    }

    await sequelize.query(`UPDATE students_${instituteNumber} SET name=?,phoneNumber=?,address=?,email=?,photo=?`,{
        type : QueryTypes.UPDATE,
        replacements : [
            name || student.name,
            phoneNumber || student.phoneNumber,
            address || student.address, 
            photo || student.photo
            
        ]
    })
    res.status(200).json({
        message : "Student profile updated"
    })
}