class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 500
        this.explanation = message;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;

