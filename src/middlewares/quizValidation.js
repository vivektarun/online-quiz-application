const { StatusCodes } = require("http-status-codes");
const { errorResponse } = require("../utils/common/responseHandler"); // adjust path as needed
const AppError = require("../utils/errors");

// Validation for create quiz
function validateCreateQuiz(req, res, next) {
  const { title } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    const error = new AppError("Quiz title is required and must be a non-empty string.", StatusCodes.BAD_REQUEST);
    return errorResponse(res, error.message, error.statusCode, error);
  }
  next();
}

// Validation for update quiz
function validateUpdateQuiz(req, res, next) {
  const { title } = req.body;
  if (title && (typeof title !== "string" || !title.trim())) {
    const error = new AppError("If provided, quiz title must be a non-empty string.", StatusCodes.BAD_REQUEST);
    return errorResponse(res, error.message, error.statusCode, error);
  }
  next();
}

// Validate quizId param for getById, update, delete
function validateQuizIdParam(req, res, next) {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    const error = new AppError("Quiz ID is required and must be a valid number.", StatusCodes.BAD_REQUEST);
    return errorResponse(res, error.message, error.statusCode, error);
  }
  next();
}

module.exports = {
  validateCreateQuiz,
  validateUpdateQuiz,
  validateQuizIdParam,
};
