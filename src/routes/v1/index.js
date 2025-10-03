const express = require('express');

const { InfoController } = require('../../controllers');
const quizRoutes = require('./quiz.routes');
const questionRoutes = require('./question.routes');
const submissionRoutes = require('./submission.routes');

const router = express.Router();

// GET /info - Health check endpoint to verify API is running
router.get('/info', InfoController.info);

// Mount quiz-related routes under /quizzes
router.use('/quizzes', quizRoutes);

// Mount question-related routes under /questions
router.use('/questions', questionRoutes);

// Mount submission-related routes under /submissions
router.use('/submissions', submissionRoutes);

// Export the configured router for use in the app
module.exports = router;
