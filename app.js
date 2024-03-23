const express  = require("express")
const app = express()
require("dotenv").config()

require("./model/index")

app.use(express.json())
//routes
const userRoute = require('./routes/user/userRoute')
const instituteRoute = require('./routes/institute/instituteRoute')


app.use("/api/user",userRoute)
app.use("/api/insitute",instituteRoute)

const PORT = process.env.PORT || 4000
app.listen(PORT,()=>{
    console.log(`[server] has started at port ${3000}`)
})