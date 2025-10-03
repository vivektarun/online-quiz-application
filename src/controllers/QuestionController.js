const { StatusCodes } = require("http-status-codes");
const { responseHandler } = require("../utils/common");

/**
 * Controller class to handle question-related HTTP requests
 */
class QuestionController {
    constructor(questionService) {
        this.questionService = questionService;

        // Bind methods for consistent `this` context when used as callbacks
        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
    }

    /**
     * Handle POST /questions to create a new question with answers
     */
    async create(req, res, next) {
        try {
            // Delegate question creation (with answers) to service layer
            const question = await this.questionService.createQuestionWithAnswer(req.body);

            // Send success response with 201 Created status
            responseHandler.successResponse(res, 'Question created successfully', question, StatusCodes.CREATED);
        } catch (err) {
            // Forward any errors to global error handler
            next(err);
        }
    } 

    /**
     * Handle GET /questions to fetch all questions optionally filtered by quizId
     */
    async getAll(req, res, next) {
        try {
            // Parse optional quizId query parameter to integer
            const quizId = req.query.quizId ? parseInt(req.query.quizId, 10) : undefined;

            // Fetch questions with their answers via service
            const questions = await this.questionService.getAllQuestionsWithAnswers(quizId);

            // Filter out answers for questions of 'text' type (to omit irrelevant answers)
            const sanitizedQuestions = questions.map(q => {
                const question = q.toJSON();
                if(question.type === 'text') {
                    delete question.answers; // Remove answers array completely
                }
                return question;
            });

            // Send success response with filtered questions data
            responseHandler.successResponse(res, 'Questions with answers fetched successfully', sanitizedQuestions, StatusCodes.OK);
        } catch (err) {
            // Forward errors to global error handler middleware
            next(err);
        }
    }
}

module.exports = QuestionController;
