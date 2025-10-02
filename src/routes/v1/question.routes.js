const express = require('express');
const router = express.Router();

const { questionController } = require('../../compositionRoot')

const { questionValidator } = require('../../middlewares');
const {
    validateCreateQuestion,
    validateQuizIdQueryParam
} = questionValidator;

router.post('/', validateCreateQuestion, questionController.create);
router.get('/', validateQuizIdQueryParam, questionController.getAll);

module.exports = router;