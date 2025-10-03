const { StatusCodes } = require("http-status-codes");
const { responseHandler } = require("../utils/common");

/**
 * Controller class to handle quiz-related HTTP requests
 */
class QuizController {
    constructor(quizService) {
        this.quizService = quizService;

        // Bind methods for consistent `this` context when used as callbacks in routes
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    /**
     * Handle GET /quizzes - fetch all quizzes
     */
    async getAll(req, res, next) {
        try {
            // Call service layer to retrieve all quizzes
            const quizzes = await this.quizService.getAll();

            // Send success response with quizzes and default 200 OK status
            responseHandler.successResponse(res, 'Quizzes fetched successfully', quizzes);
        } catch (err) {
            // Pass errors to the global error handler middleware
            next(err);
        }
    }

    /**
     * Handle GET /quizzes/:id - fetch a quiz by ID
     */
    async getById(req, res, next) {
        try {
            const { id } = req.params;

            // Call service layer to fetch specific quiz by ID
            const quiz = await this.quizService.getById(id);

            // Send success response with quiz data
            responseHandler.successResponse(res, 'Quiz fetched successfully', quiz);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Handle POST /quizzes - create a new quiz
     */
    async create(req, res, next) {
        try {
            // Delegate creation to the service layer
            const quiz = await this.quizService.create(req.body);

            // Send created response with 201 Created status code
            responseHandler.successResponse(res, 'Quiz created successfully', quiz, StatusCodes.CREATED);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Handle PUT /quizzes/:id - update an existing quiz by ID
     */
    async update(req, res, next) {
        try {
            // Delegate update to service
            const quiz = await this.quizService.update(req.params.id, req.body);

            // Send success response with updated quiz data
            responseHandler.successResponse(res, 'Quiz updated successfully', quiz);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Handle DELETE /quizzes/:id - delete a quiz by ID
     */
    async delete(req, res, next) {
        try {
            // Delegate deletion to service
            await this.quizService.delete(req.params.id);

            // Send success response with no additional data
            responseHandler.successResponse(res, 'Quiz deleted successfully');
        } catch (err) {
            next(err);
        }
    }
}

module.exports = QuizController;
