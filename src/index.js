const express = require('express');
const { serverConfig } = require('../src/config');
const apiRoutes = require('./routes');

const { errors } = require('../src/utils');
const { globalErrorHandler } = errors;

const app = express();

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Middleware to parse URL-encoded data (e.g., form submissions)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse plain text bodies
app.use(express.text());

// Mount all API routes under /api path
app.use('/api', apiRoutes);

// Global error handler middleware to catch and handle errors across the app
app.use(globalErrorHandler);

// Start server on configured port
app.listen(serverConfig.PORT, () => {
  console.log(`Server running on http://localhost:${serverConfig.PORT}`);
});
