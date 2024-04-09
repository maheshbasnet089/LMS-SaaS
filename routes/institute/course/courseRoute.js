const { createCourse, getAllCourses, deleteCourse, getSingleCourse } = require("../../../controller/institute/course/courseController")
const { isAuthenticated } = require("../../../middleware/isAuthenticated")

const router = require("express").Router()
const {multer,storage} = require("./../../../services/multerConfig")
const upload = multer({storage:storage})

router.route("/").post(isAuthenticated,upload.single('image'),createCourse).get(isAuthenticated,getAllCourses)
router.route("/:id").delete(isAuthenticated,deleteCourse).get(isAuthenticated,getSingleCourse)

module.exports = router