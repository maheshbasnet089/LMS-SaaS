

module.exports = {
    host : 'localhost',
    username : 'root',
    password : '',
    db:"lmssaas",
    dialect : 'mysql',
    pool : {
        min : 0, 
        max : 5, 
        idle : 10000,
        acquire : 10000
    }
}