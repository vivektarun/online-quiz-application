const { StatusCodes } = require('http-status-codes');
const { responseHandler } = require('../utils/common');

class SubmissionController {
    constructor(submissionService) {
        this.submissionService = submissionService;
        this.create = this.create.bind(this);
    }
    async create(req, res, next) {
        try {
            const submissionResult = await this.submissionService.createSubmission(req.body);
            responseHandler.successResponse(res, 'Submission recorded successfully', submissionResult ,StatusCodes.CREATED);
        } catch (err) {
            next(err);
        }
    } 
}

module.exports = SubmissionController;