const express  = require("express")
const app = express()
require("dotenv").config()

require("./model/index")

app.use(express.json())
//routes
const userRoute = require('./routes/user/userRoute')
const instituteRoute = require('./routes/institute/instituteRoute')
const teacherRoute = require('./routes/institute/teacher/teacherRoute')


app.use("/api/user",userRoute)
app.use('/api/institute/teacher',teacherRoute)
app.use("/api/institute",instituteRoute)

const PORT = process.env.PORT || 4000
app.listen(PORT,()=>{
    console.log(`[server] has started at port ${3000}`)
})

//sudo /Applications/XAMPP/xamppfiles/xampp start