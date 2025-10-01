const express = require('express');
const router = express.Router();

const { questionController } = require('../../compositionRoot')

router.post('/', questionController.create);
router.get('/', questionController.getAll);

module.exports = router;