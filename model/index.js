
const {Sequelize,DataTypes} = require('sequelize')
const dbConfig = require('../config/dbConfig')


const sequelize = new Sequelize(dbConfig.db,dbConfig.username,dbConfig.password,{
    host : dbConfig.host,
    dialect : dbConfig.dialect,
    port : 3306,
    pool : {
        min : dbConfig.pool.min,
        max : dbConfig.pool.max,
        idle : dbConfig.pool.idle,
        acquire : dbConfig.pool.acquire
    }
})

sequelize.authenticate().then(()=>{
    console.log("Connected")
})
.catch((err)=>{
    console.log(err)
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

// models 
db.users = require("./userModel")(sequelize,DataTypes)


db.sequelize.sync({force:false}).then(()=>{
    console.log("Migrated !!!")
})

module.exports = db