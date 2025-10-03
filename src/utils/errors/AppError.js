/**
 * Custom error class extending the built-in Error.
 * Used to add HTTP status code and additional explanation for errors.
 */
class AppError extends Error {
    /**
     * Create an AppError instance
     * @param {string} message - Error message describing the error
     * @param {number} statusCode - HTTP status code associated with the error (default 500)
     */
    constructor(message, statusCode) {
        super(message);                  // Call parent Error constructor with message
        this.statusCode = statusCode || 500;  // Assign status code or default to 500 (Internal Server Error)
        this.explanation = message;     // Additional explanation property (could be used for detailed error info)
        Error.captureStackTrace(this, this.constructor); // Capture stack trace excluding constructor call
    }
}

module.exports = AppError;
