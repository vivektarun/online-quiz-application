const express = require('express');

const { InfoController } = require('../../controllers');
const quizRoutes = require('./quiz.routes');
const questionRoutes = require('./question.routes');

const router = express.Router();

router.get('/info', InfoController.info);
router.use('/quiz', quizRoutes);
router.use('/question', questionRoutes);

module.exports = router;