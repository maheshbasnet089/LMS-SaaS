const { teacherLogin, logOutTeacher, changePassword, getProfile, updateMe } = require("../../controller/teacher/teacherController")
const { isAuthenticatedTeacher } = require("../../middleware/isAuthenticatedTeacher")

const router = require("express").Router()

router.route("/login").post(teacherLogin)
router.route("/logout").post(isAuthenticatedTeacher, logOutTeacher)
router.route("/changepassword").post(isAuthenticatedTeacher,changePassword)
router.route("/profile")
.get(isAuthenticatedTeacher,getProfile)
.patch(isAuthenticatedTeacher,updateMe)
module.exports = router 