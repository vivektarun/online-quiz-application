const { StatusCodes } = require('http-status-codes');
const { responseHandler } = require('../utils/common');

/**
 * Controller class to handle submission-related HTTP requests
 */
class SubmissionController {
    constructor(submissionService) {
        this.submissionService = submissionService;

        // Bind methods to maintain `this` context when used as callback
        this.create = this.create.bind(this);
    }

    /**
     * Handle POST /submissions to create a new submission record
     */
    async create(req, res, next) {
        try {
            // Delegate submission creation to the service layer
            const submissionResult = await this.submissionService.createSubmission(req.body);

            // Send success response with 201 Created status and submission result
            responseHandler.successResponse(res, 'Submission recorded successfully', submissionResult, StatusCodes.CREATED);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = SubmissionController;
