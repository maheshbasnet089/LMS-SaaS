const { createTeacher, deleteTeacher, getTeachers } = require("../../../controller/institute/teacher/teacherController")
const { isAuthenticated } = require("../../../middleware/isAuthenticated")

const router = require("express").Router()

const {multer,storage} = require("../../../services/multerConfig")
const upload = multer({storage:storage})


router.route('/').post(isAuthenticated,upload.single('image'),createTeacher).get(isAuthenticated,getTeachers)
router.route("/:teacherId").delete(isAuthenticated,deleteTeacher)


module.exports = router 