const express = require('express');
const router = express.Router();

const { QuestionController } = require('../../controllers');

const questionController = new QuestionController();

router.post('/', questionController.create);
router.get('/', questionController.getAll);

module.exports = router;