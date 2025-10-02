const express = require('express');
const router = express.Router();

const { submissionController } = require('../../compositionRoot');

const { submissionValidator } = require('../../middlewares');

const {
    validateCreateSubmission
} = submissionValidator;

router.post('/', validateCreateSubmission, submissionController.create);

module.exports = router;
