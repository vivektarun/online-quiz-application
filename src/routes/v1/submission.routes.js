const express = require('express');
const router = express.Router();

const { submissionController } = require('../../compositionRoot');

router.post('/', submissionController.create);

module.exports = router;
