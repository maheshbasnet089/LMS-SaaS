const { registerUser, loginUser } = require("../../controller/user/userController")

const router = require("express").Router()


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

module.exports = router