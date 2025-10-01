const { StatusCodes } = require("http-status-codes");
const { responseHandler } = require("../utils/common");

class QuizController {
    constructor(quizService) {
        this.quizService = quizService;
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(req, res, next) {
        try {
            const quizzes = await this.quizService.getAll();
            responseHandler.successResponse(res, 'Quizzes fetched successfully', quizzes);
        } catch (err) {
            next(err);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const quiz = await this.quizService.getById(id);
            responseHandler.successResponse(res, 'Quiz fetched successfully', quiz);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            console.log("in create controller")
            const quiz = await this.quizService.create(req.body);
            responseHandler.successResponse(res, 'Quiz created successfully', quiz, StatusCodes.CREATED);
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const quiz = await this.quizService.update(req.params.id, req.body);
            responseHandler.successResponse(res, 'Quiz updated successfully', quiz);
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            await this.quizService.delete(req.params.id);
            responseHandler.successResponse(res, 'Quiz deleted successfully');
        } catch (err) {
            next(err);
        }
    }
}

module.exports = QuizController;