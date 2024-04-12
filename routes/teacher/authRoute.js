const { teacherLogin } = require("../../controller/teacher/teacherController")

const router = require("express").Router()

router.route("/login").post(teacherLogin)

module.exports = router 