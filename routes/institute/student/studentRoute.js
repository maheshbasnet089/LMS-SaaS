const { createStudent, getStudents, deleteStudent } = require("../../../controller/institute/student/studentController")
const { isAuthenticated } = require("../../../middleware/isAuthenticated")

const router = require("express").Router()

const {multer,storage} = require("../../../services/multerConfig")
const upload = multer({storage:storage})


router.route('/').post(isAuthenticated,upload.single('image'),createStudent).get(isAuthenticated,getStudents)
router.route("/:studentId").delete(isAuthenticated,deleteStudent)


module.exports = router 