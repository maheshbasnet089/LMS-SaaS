const express  = require("express")
const app = express()
require("dotenv").config()

require("./model/index")

app.use(express.json())
//routes
const userRoute = require('./routes/user/userRoute')


app.use("/api/",userRoute)

const PORT = process.env.PORT || 4000
app.listen(PORT,()=>{
    console.log(`[server] has started at port ${3000}`)
})