const { errorResponse } = require('../common/responseHandler');
const { serverConfig } = require('../../config');

/**
 * Global error handling middleware for Express.
 * Captures all errors thrown in routes/controllers and formats a consistent JSON error response.
 * Shows stack trace only in development environment for security.
 * 
 * @param {Error} err - The error object thrown
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function (not used here, but required signature)
 * @returns {Object} Express JSON error response with appropriate status code
 */
const globalErrorHandler = (err, req, res, next) => {
  // Use error's statusCode if set; otherwise, default to HTTP 500
  const statusCode = err.statusCode || 500;

  // Use error's message if set; provide generic fallback message
  const message = err.message || 'Internal Server Error';

  // Include error stack trace in response only during development for debugging
  const errorDetails = serverConfig.NODE_ENV === 'development' ? { stack: err.stack } : {};

  // Send standardized error response using common errorResponse utility
  return errorResponse(res, message, statusCode, errorDetails);
};

module.exports = globalErrorHandler;
