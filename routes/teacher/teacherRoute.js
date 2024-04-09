const { createCourseSyllabus } = require("../../controller/teacher/courseSyllabus")
const { isAuthenticatedTeacher } = require("../../middleware/isAuthenticatedTeacher")

const router = require("express").Router()
const {multer,storage} = require("./../../services/multerConfig")
const upload = multer({storage:storage})

router.route("/syllabus").post(isAuthenticatedTeacher,upload.single('image'), createCourseSyllabus)

module.exports = router 