const express  = require("express")
const app = express()
require("dotenv").config()

require("./model/index")

app.use(express.json())
//routes
const userRoute = require('./routes/user/userRoute')
const instituteRoute = require('./routes/institute/instituteRoute')
const teacherRoute = require('./routes/institute/teacher/teacherRoute')
const categoryRoute = require("./routes/institute/category/categoryRoute")
const courseRoute = require("./routes/institute/course/courseRoute")
const teacherSyllabusRoute = require("./routes/teacher/teacherRoute")


app.use("/api/user",userRoute)
app.use('/api/institute/teacher',teacherRoute)
app.use("/api/institute",instituteRoute)
app.use("/api/institute/category",categoryRoute)
app.use("/api/institute/course",courseRoute)
app.use("/api/institute/teacher",teacherSyllabusRoute)

const PORT = process.env.PORT || 8000
app.listen(PORT,()=>{
    console.log(`[server] has started at port ${3000}`)
})

//sudo /Applications/XAMPP/xamppfiles/xampp start