const { createCourseSyllabus } = require("../../controller/teacher/courseSyllabus")
const { isAuthenticatedTeacher } = require("../../middleware/isAuthenticatedTeacher")

const router = require("express").Router()
const {multer,storage} = require("../../services/multerConfig")
const upload = multer({storage:storage})

router.route("/").post(isAuthenticatedTeacher,upload.single('video'), createCourseSyllabus)


module.exports = router 