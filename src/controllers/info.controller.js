const { StatusCodes } = require('http-status-codes');

/**
 * Controller function to provide basic API health check information
 * Responds with HTTP 200 OK and a simple success message
 */
function info(req, res) {
    return res.status(StatusCodes.OK).json({
        sucess: true,               // Indicates request was successful
        message: 'Api is up',      // Simple status message
        error: {},                 // Empty error object since no errors
        data: {}                   // Empty data object for future extensibility
    });
}

module.exports = {
    info
};
