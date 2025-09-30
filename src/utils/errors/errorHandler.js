const { errorResponse } = require('../common/responseHandler')
const { ServerConfig } = require('../../config');

const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errorDetails = ServerConfig.NODE_ENV === 'development' ? { stack: err.stack } : {};

  return errorResponse(res, message, statusCode, errorDetails);
};

module.exports = globalErrorHandler;
