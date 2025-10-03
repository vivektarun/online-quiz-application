const { StatusCodes } = require("http-status-codes");

/**
 * Sends a standardized success JSON response
 * @param {Object} res - Express response object
 * @param {string} message - Success message to include in response
 * @param {Object} data - Data payload to send (default: empty object)
 * @param {number} statusCode - HTTP status code (default: 200 OK)
 * @returns {Object} Express response with JSON body
 */
const successResponse = (res, message, data = {}, statusCode = StatusCodes.OK) => {
  return res.status(statusCode).json({
    success: true,   // Indicates operation was successful
    message,         // Human-readable success message
    data,            // Data payload containing requested info or results
    error: {}        // Empty error object for consistent response structure
  });
};

/**
 * Sends a standardized error JSON response
 * @param {Object} res - Express response object
 * @param {string} message - Error message describing the failure
 * @param {number} statusCode - HTTP status code indicating error type
 * @param {Object} error - Additional error details or object (default: empty)
 * @returns {Object} Express response with JSON error body
 */
const errorResponse = (res, message, statusCode, error = {}) => {
  return res.status(statusCode).json({
    success: false,  // Indicates operation failed
    message,         // Human-readable error message
    data: {},        // Empty data object for consistent response structure
    error            // Optional detailed error info for debugging or client info
  });
};

module.exports = {
  successResponse,
  errorResponse
};
