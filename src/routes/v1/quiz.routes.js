const express = require('express');
const router = express.Router();
const { quizController } = require('../../compositionRoot');
const { quizValidator } = require('../../middlewares');
const {
    validateCreateQuiz,
    validateUpdateQuiz,
    validateQuizIdParam
} = quizValidator;


router.get('/', quizController.getAll);
router.get('/:id', validateQuizIdParam, quizController.getById);
router.post('/', validateCreateQuiz, quizController.create);
router.put('/:id', validateQuizIdParam, validateUpdateQuiz, quizController.update);
router.delete('/:id', validateQuizIdParam, quizController.delete);

module.exports = router;