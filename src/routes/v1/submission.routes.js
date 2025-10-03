const express = require('express');
const router = express.Router();

const { submissionController } = require('../../compositionRoot');

const { submissionValidator } = require('../../middlewares');
const {
    validateCreateSubmission
} = submissionValidator;

// POST /submissions - Create a new submission
// validateCreateSubmission middleware ensures the request body is valid before creation
router.post('/', validateCreateSubmission, submissionController.create);

module.exports = router;
