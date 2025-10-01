const express = require('express');
const router = express.Router();

const { QuizController } = require('../../controllers');
const quizController = new QuizController();

router.get('/', quizController.getAll);
router.get('/:id', quizController.getById);
router.post('/', quizController.create);
router.put('/:id', quizController.update);
router.delete('./:id', quizController.delete);

module.exports = router;