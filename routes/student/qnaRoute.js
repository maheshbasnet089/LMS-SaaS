const { askQuestion, getQuestions, getAnswers, answerQuestion, deleteMyQuestion, deleteMyAnswer, updateAnswer } = require('../../controller/student/qnaController')
const { isAuthenticatedStudent } = require('../../middleware/isAuthenticatedStudent')

const router = require('express').Router()


router.route("/question").post(isAuthenticatedStudent,askQuestion).get(isAuthenticatedStudent,getQuestions)
router.route("/question/:questionId").delete(isAuthenticatedStudent,deleteMyQuestion)
router.route("/answer/:answerId").get(isAuthenticatedStudent,getAnswers).post(isAuthenticatedStudent,answerQuestion).delete(isAuthenticatedStudent,deleteMyAnswer).patch(isAuthenticatedStudent,updateAnswer)


module.exports = router 