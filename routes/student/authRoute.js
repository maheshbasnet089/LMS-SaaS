const { studentLogin, logOutStudent, changePassword, getProfile, updateMe } = require("../../controller/student/authController")
const { isAuthenticatedStudent } = require("../../middleware/isAuthenticatedStudent")


const router = require("express").Router()

router.route("/login").post(studentLogin)

router.route("/logout").post(isAuthenticatedStudent, logOutStudent)
router.route("/changepassword").post(isAuthenticatedStudent,changePassword)
router.route("/profile")
.get(isAuthenticatedStudent,getProfile)
.patch(isAuthenticatedStudent,updateMe)
module.exports = router 