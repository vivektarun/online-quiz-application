const express = require('express');
const router = express.Router();

const { questionController } = require('../../compositionRoot')

const { questionValidator } = require('../../middlewares');
const {
    validateCreateQuestion,
    validateQuizIdQueryParam
} = questionValidator;

// POST /questions - create a new question with request body validated
router.post('/', validateCreateQuestion, questionController.create);

// GET /questions?quizId=... - get all questions filtered by quizId query parameter
// validateQuizIdQueryParam middleware ensures that the quizId query param is present and valid
router.get('/', validateQuizIdQueryParam, questionController.getAll);

module.exports = router;