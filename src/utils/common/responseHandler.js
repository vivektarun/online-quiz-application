const { StatusCodes } = require("http-status-codes");

const successResponse = (res, message, data = {}, statusCode = StatusCodes.OK) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    error: {}
  });
};

const errorResponse = (res, message, statusCode, error = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: {},
    error
  });
};

module.exports = {
  successResponse,
  errorResponse
};
