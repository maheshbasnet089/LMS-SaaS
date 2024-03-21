const jwt = require('jsonwebtoken')
const {promisify} = require("util")

exports.isAuthenticated =  async(req,res,next)=>{
    const token = req.headers.token 
    if(!token || token === "" || token === undefined || token === null){
        return res.status(400).json({
            message : "Please provide token"
        })
    }

    const result =  promisify(jwt.verify(token,process.env.SECRET_KEY))

    const [userData] = await users.findAll({
        where : {
            id : result.id
        }
    })
    if(!userData){
        return res.status(404).json({
            message : "Invalid token"
        })
    }
    req.userId = userData.id
    req.instituteNumber = userData.currentInstituteNumber
    next()
}