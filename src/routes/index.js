const express = require('express');

// Import all API routes for version 1
const v1Routes = require('./v1');

const router = express.Router();

// Mount all routes under '/v1' path to support API versioning
router.use('/v1', v1Routes);

// Export the root router to be used in the main app
module.exports = router;
