

module.exports = (sequelize,DataTypes)=>{
    const User = sequelize.define("user",{
        email : {
            type : DataTypes.STRING,
            allowNull : false,
            unique : true
        },
        username : {
            type : DataTypes.STRING,
            allowNull : false,
            unique : true
        },
        password : {
            type : DataTypes.STRING,
            allowNull : false
        },
        currentInstituteNumber : {
            type : DataTypes.INTEGER,
            
        }
    })
    return User
}