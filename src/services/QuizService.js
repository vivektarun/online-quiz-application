const { StatusCodes } = require('http-status-codes');
const { errors } = require('../utils');
const { AppError } = errors;


class QuizService {
    constructor(quizRepository) {
        this.quizRepository = quizRepository;
    }

    async getAll() {
        return this.quizRepository.getAll();
    }

    async getById(id) {
        const quiz = await this.quizRepository.findById(id);
        if(!quiz) throw new AppError('Quiz not found', StatusCodes.NOT_FOUND);
        return quiz;
    }

    async create(data) {
        return this.quizRepository.create(data);
    }

    async update(id, data) {
        const quiz = await this.getById(id);
        return this.quizRepository.update(quiz.id, data);
    }

    async delete(id) {
        await this.getById(id);
        return this.quizRepository.destroy(id);
    }
}

module.exports = QuizService;