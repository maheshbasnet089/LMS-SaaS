const { createTeacher, deleteTeacher, getTeachers } = require("../../../controller/institute/teacher/teacherController")
const { isAuthenticated } = require("../../../middleware/isAuthenticated")

const router = require("express").Router()

router.route('/').post(isAuthenticated,createTeacher).get(isAuthenticated,getTeachers)
router.route("/:teacherId").delete(isAuthenticated,deleteTeacher)


module.exports = router 