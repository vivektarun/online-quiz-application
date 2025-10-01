const express = require('express');
const router = express.Router();
const { SubmissionController } = require('../../controllers');

const submissionController = new SubmissionController();

router.post('/', submissionController.create);

module.exports = router;
