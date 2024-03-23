const { createInsitute, createStudentTable, createTeacherTable, createUsersInstitutes, setCurrentOrganizationNumber } = require('../../controller/institute/instituteController')
const { isAuthenticated } = require('../../middleware/isAuthenticated')

const router = require('express').Router()


router.route("/").post(isAuthenticated, createInsitute,createUsersInstitutes, createStudentTable, createTeacherTable,setCurrentOrganizationNumber)

module.exports = router