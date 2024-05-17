const { createInsitute, createStudentTable, createTeacherTable, createUsersInstitutes, setCurrentOrganizationNumber, createCategoryTable, createSyllabusTable, createSyllabusVideoTable, createSyllabusQnaSession, createSyllabusReviewTable, courseSyllabusQuestionsAnswerTable, createCourseTable, deleteOrganization, changeInstitute, getMyInstitutes, getMyCurrentInstituteData } = require('../../controller/institute/instituteController')
const { isAuthenticated } = require('../../middleware/isAuthenticated')
const catchAsync = require('../../services/catchAsync')

const router = require('express').Router()


router.route("/").post(isAuthenticated, catchAsync(createInsitute),catchAsync(createUsersInstitutes), catchAsync( createStudentTable ), catchAsync( createTeacherTable),catchAsync(createCategoryTable),catchAsync(createSyllabusTable),catchAsync(createSyllabusVideoTable),catchAsync(createSyllabusQnaSession),catchAsync(createSyllabusReviewTable),catchAsync(courseSyllabusQuestionsAnswerTable), 
catchAsync(createCourseTable), catchAsync(setCurrentOrganizationNumber))
.delete(isAuthenticated,catchAsync(deleteOrganization))
.get(isAuthenticated,catchAsync(getMyInstitutes))

router.route("/currentInstitute").get(isAuthenticated,catchAsync(getMyCurrentInstituteData))

router.route("/changeOrganization").post(isAuthenticated,catchAsync(changeInstitute))



module.exports = router