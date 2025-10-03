const express = require('express');
const router = express.Router();
const { quizController } = require('../../compositionRoot');
const { quizValidator } = require('../../middlewares');
const {
    validateCreateQuiz,
    validateUpdateQuiz,
    validateQuizIdParam
} = quizValidator;

// GET /quizzes - Retrieve all quizzes
router.get('/', quizController.getAll);

// GET /quizzes/:id - Retrieve a quiz by its ID with ID validation
router.get('/:id', validateQuizIdParam, quizController.getById);

// POST /quizzes - Create a new quiz; validates request body before creation
router.post('/', validateCreateQuiz, quizController.create);

// PUT /quizzes/:id - Update an existing quiz by ID; validates ID and update data
router.put('/:id', validateQuizIdParam, validateUpdateQuiz, quizController.update);

// DELETE /quizzes/:id - Delete a quiz by its ID with ID validation
router.delete('/:id', validateQuizIdParam, quizController.delete);

module.exports = router;
