const express = require('express');

const { InfoController } = require('../../controllers');
const quizRoutes = require('./quiz.routes');
const questionRoutes = require('./question.routes');
const submissionRoutes = require('./submission.routes');

const router = express.Router();

router.get('/info', InfoController.info);
router.use('/quiz', quizRoutes);
router.use('/question', questionRoutes);
router.use('/submission', submissionRoutes);

module.exports = router;