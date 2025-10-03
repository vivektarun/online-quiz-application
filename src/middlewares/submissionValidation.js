const { StatusCodes } = require("http-status-codes");
const { errorResponse } = require("../utils/common/responseHandler");
const { AppError } = require("../utils/errors");

/**
 * Middleware to validate the request body when creating a submission
 */
function validateCreateSubmission(req, res, next) {
  const { quizId, answers } = req.body;

  // Validate quizId - required and must be a valid number
  if (!quizId || isNaN(Number(quizId))) {
    const error = new AppError("quizId is required and must be a valid number.", StatusCodes.BAD_REQUEST);
    return errorResponse(res, error.message, error.statusCode, error);
  }

  // Validate answers - must be an array and not empty
  if (!Array.isArray(answers) || answers.length === 0) {
    const error = new AppError("Answers must be a non-empty array.", StatusCodes.BAD_REQUEST);
    return errorResponse(res, error.message, error.statusCode, error);
  }

  // Iterate over each answer object for detailed field validations
  for (const [index, ans] of answers.entries()) {
    // questionId must exist and be a valid number
    if (!ans.questionId || isNaN(Number(ans.questionId))) {
      const error = new AppError(`Answer at index ${index} missing valid questionId.`, StatusCodes.BAD_REQUEST);
      return errorResponse(res, error.message, error.statusCode, error);
    }

    // Validate presence of either selectedAnswerId or textAnswer (but not both)
    const hasSelectedAnswerId = ans.hasOwnProperty("selectedAnswerId");
    const hasTextAnswer = ans.hasOwnProperty("textAnswer");

    if (!hasSelectedAnswerId && !hasTextAnswer) {
      const error = new AppError(`Answer at index ${index} must have either selectedAnswerId or textAnswer.`, StatusCodes.BAD_REQUEST);
      return errorResponse(res, error.message, error.statusCode, error);
    }

    if (hasSelectedAnswerId && hasTextAnswer) {
      const error = new AppError(`Answer at index ${index} cannot have both selectedAnswerId and textAnswer.`, StatusCodes.BAD_REQUEST);
      return errorResponse(res, error.message, error.statusCode, error);
    }

    // Validate selectedAnswerId is a number or an array of numbers
    if (hasSelectedAnswerId) {
      if (
        !(
          typeof ans.selectedAnswerId === "number" ||
          (Array.isArray(ans.selectedAnswerId) &&
            ans.selectedAnswerId.every(id => !isNaN(Number(id))))
        )
      ) {
        const error = new AppError(
          `selectedAnswerId at index ${index} must be a number or array of numbers.`,
          StatusCodes.BAD_REQUEST
        );
        return errorResponse(res, error.message, error.statusCode, error);
      }
    }

    // Validate textAnswer is a non-empty string
    if (hasTextAnswer) {
      if (typeof ans.textAnswer !== "string" || !ans.textAnswer.trim()) {
        const error = new AppError(`textAnswer at index ${index} must be a non-empty string.`, StatusCodes.BAD_REQUEST);
        return errorResponse(res, error.message, error.statusCode, error);
      }
    }
  }

  // All validation passed; proceed to next middleware/controller
  next();
}

module.exports = {
  validateCreateSubmission,
};
