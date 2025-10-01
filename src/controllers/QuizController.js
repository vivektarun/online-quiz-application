const { StatusCodes } = require("http-status-codes");
const { QuizService } = require("../services");
const { responseHandler } = require("../utils/common");

const quizService = new QuizService();

class QuizController {
    async getAll(req, res, next) {
        try {
            const quizzes = await quizService.getAll();
            responseHandler.successResponse(res, 'Quizzes fetched successfully', quizzes);
        } catch (err) {
            next(err);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const quiz = await quizService.create(id);
            responseHandler.successResponse(res, 'Quiz fetched successfully', quiz);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const quiz = await quizService.create(req.body);
            responseHandler.successResponse(res, 'Quiz created successfully', quiz, StatusCodes.CREATED);
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const quiz = await quizService.update(req.params.id, req.body);
            responseHandler.successResponse(res, 'Quiz updated successfully', quiz);
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            await quizService.delete(req.params.id);
            responseHandler.successResponse(res, 'Quiz deleted successfully');
        } catch (err) {
            next(err);
        }
    }
}

module.exports = QuizController;