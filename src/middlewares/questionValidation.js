const { StatusCodes } = require("http-status-codes");
const { errorResponse } = require("../utils/common/responseHandler");
const { AppError } = require("../utils/errors");

const { Enums } = require('../utils/common');
const { SINGLE_CHOICE, MULTIPLE_CHOICE, TEXT } = Enums.QUESTION_TYPE;

// Allowed question types
const validTypes = [SINGLE_CHOICE, MULTIPLE_CHOICE, TEXT];

function validateCreateQuestion(req, res, next) {
  const { quizId, text, type, answers } = req.body;

  // Validate quizId
  if (!quizId || isNaN(Number(quizId))) {
    const error = new AppError("quizId is required and must be a valid number.", StatusCodes.BAD_REQUEST);
    return errorResponse(res, error.message, error.statusCode, error);
  }

  // Validate question text presence and length
  if (!text || typeof text !== "string" || !text.trim()) {
    const error = new AppError("Question text is required and must be a non-empty string.", StatusCodes.BAD_REQUEST);
    return errorResponse(res, error.message, error.statusCode, error);
  }
  if (text.length > 300) {
    const error = new AppError("Question text cannot exceed 300 characters.", StatusCodes.BAD_REQUEST);
    return errorResponse(res, error.message, error.statusCode, error);
  }

  // Validate type
  if (!type || !validTypes.includes(type)) {
    const error = new AppError(`Question type must be one of: ${validTypes.join(", ")}.`, StatusCodes.BAD_REQUEST);
    return errorResponse(res, error.message, error.statusCode, error);
  }

  // Validate answers for choice questions
  if (type ===SINGLE_CHOICE || type === MULTIPLE_CHOICE) {
    if (!Array.isArray(answers) || answers.length === 0) {
      const error = new AppError("Answers array is required and must not be empty for choice questions.", StatusCodes.BAD_REQUEST);
      return errorResponse(res, error.message, error.statusCode, error);
    }

    // Check at least one correct answer
    if (!answers.some(a => a.isCorrect === true)) {
      const error = new AppError("At least one answer must be marked as correct.", StatusCodes.BAD_REQUEST);
      return errorResponse(res, error.message, error.statusCode, error);
    }

    // Validate each answer format
    for (const ans of answers) {
      if (!ans.text || typeof ans.text !== "string" || !ans.text.trim() || typeof ans.isCorrect !== "boolean") {
        const error = new AppError("Each answer must have non-empty text and an isCorrect boolean.", StatusCodes.BAD_REQUEST);
        return errorResponse(res, error.message, error.statusCode, error);
      }
    }
  }

  // Validate answers for text questions
  if (type === "text") {
    if (!Array.isArray(answers) || answers.length === 0) {
      const error = new AppError("Answers array is required and must not be empty for text questions.", StatusCodes.BAD_REQUEST);
      return errorResponse(res, error.message, error.statusCode, error);
    }

    // Validate all answers have isCorrect === true
    const allCorrect = answers.every(a => a.isCorrect === true);
    if (!allCorrect) {
      const error = new AppError("All answers for a text question must be marked as correct.", StatusCodes.BAD_REQUEST);
      return errorResponse(res, error.message, error.statusCode, error);
    }

    // Validate each answer has non-empty text
    for (const ans of answers) {
      if (!ans.text || typeof ans.text !== "string" || !ans.text.trim()) {
        const error = new AppError("Each answer must have non-empty text for text questions.", StatusCodes.BAD_REQUEST);
        return errorResponse(res, error.message, error.statusCode, error);
      }
    }
  }

  next();
}

// Validate quizId query parameter on GET requests
function validateQuizIdQueryParam(req, res, next) {
  const { quizId } = req.query;
  if (quizId !== undefined && (isNaN(Number(quizId)) || Number(quizId) <= 0)) {
    const error = new AppError("quizId query parameter must be a positive number.", StatusCodes.BAD_REQUEST);
    return errorResponse(res, error.message, error.statusCode, error);
  }
  next();
}

module.exports = {
  validateCreateQuestion,
  validateQuizIdQueryParam,
};
