const { createInsitute, createStudentTable, createTeacherTable, createUsersInstitutes, setCurrentOrganizationNumber, createCategoryTable, createSyllabusTable, createSyllabusVideoTable, createSyllabusQnaSession, createSyllabusReviewTable, courseSyllabusQuestionsAnswerTable, createCourseTable } = require('../../controller/institute/instituteController')
const { isAuthenticated } = require('../../middleware/isAuthenticated')

const router = require('express').Router()


router.route("/").post(isAuthenticated, createInsitute,createUsersInstitutes, createStudentTable, createTeacherTable,createCategoryTable,createSyllabusTable,createSyllabusVideoTable,createSyllabusQnaSession,createSyllabusReviewTable,courseSyllabusQuestionsAnswerTable, 
   createCourseTable, setCurrentOrganizationNumber)

module.exports = router