const { StatusCodes } = require("http-status-codes");
const { errorResponse } = require("../utils/common/responseHandler"); // adjust path as needed
const AppError = require("../utils/errors");

/**
 * Validate the request body when creating a quiz
 * Ensures 'title' is provided as a non-empty string
 */
function validateCreateQuiz(req, res, next) {
  const { title } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    const error = new AppError("Quiz title is required and must be a non-empty string.", StatusCodes.BAD_REQUEST);
    return errorResponse(res, error.message, error.statusCode, error);
  }

  // Passed validation, continue to next middleware/controller
  next();
}

/**
 * Validate the request body when updating a quiz
 * If 'title' is provided, it must be a non-empty string
 */
function validateUpdateQuiz(req, res, next) {
  const { title } = req.body;

  if (title && (typeof title !== "string" || !title.trim())) {
    const error = new AppError("If provided, quiz title must be a non-empty string.", StatusCodes.BAD_REQUEST);
    return errorResponse(res, error.message, error.statusCode, error);
  }

  // Passed validation, continue to next middleware/controller
  next();
}

/**
 * Validate the quiz ID path parameter for routes like getById, update, delete
 * Ensures 'id' param exists and is a valid number
 */
function validateQuizIdParam(req, res, next) {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    const error = new AppError("Quiz ID is required and must be a valid number.", StatusCodes.BAD_REQUEST);
    return errorResponse(res, error.message, error.statusCode, error);
  }

  // Passed validation, continue to next middleware/controller
  next();
}

module.exports = {
  validateCreateQuiz,
  validateUpdateQuiz,
  validateQuizIdParam,
};
