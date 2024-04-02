const { createInsitute, createStudentTable, createTeacherTable, createUsersInstitutes, setCurrentOrganizationNumber, createCategoryTable, createSyllabusTable, createSyllabusVideoTable, createSyllabusQnaSession, createSyllabusReviewTable, courseSyllabusQuestionsAnswerTable } = require('../../controller/institute/instituteController')
const { isAuthenticated } = require('../../middleware/isAuthenticated')

const router = require('express').Router()


router.route("/").post(isAuthenticated, createInsitute,createUsersInstitutes, createStudentTable, createTeacherTable,createCategoryTable,createSyllabusTable,createSyllabusVideoTable,createSyllabusQnaSession,createSyllabusReviewTable,courseSyllabusQuestionsAnswerTable, setCurrentOrganizationNumber)

module.exports = router