const { StatusCodes } = require('http-status-codes');
const { SubmissionService } = require('../services');
const { responseHandler } = require('../utils/common');

const submissionService = new SubmissionService();

class SubmissionController {
    constructor() {
        
    }

    async create(req, res, next) {
        try {
            const submissionResult = await submissionService.createSubmission(req.body);
            console.log(submissionResult);
            responseHandler.successResponse(res, 'Submission recorded successfully', submissionResult ,StatusCodes.CREATED);
        } catch (err) {
            next(err);
        }
    } 
}

module.exports = SubmissionController;