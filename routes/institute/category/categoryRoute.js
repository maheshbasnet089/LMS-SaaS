const { createCategory, getAllCategories, deleteCategory } = require("../../../controller/institute/category/categoryController")
const { isAuthenticated } = require("../../../middleware/isAuthenticated")

const router = require("express").Router()



router.route("/").post(isAuthenticated,createCategory).get(isAuthenticated,getAllCategories)
router.route("/:id").delete(isAuthenticated,deleteCategory) 


module.exports = router