const { StatusCodes } = require('http-status-codes');
const { QuizRepository } = require('../repositories');
const { errors } = require('../utils');
const { AppError } = errors;

const quizRepository = new QuizRepository();

class QuizService {
    async getAll() {
        return quizRepository.getAll();
    }

    async getById(id) {
        const quiz = await quizRepository.findById(id);
        if(!quiz) throw new AppError('Quiz not found', StatusCodes.NOT_FOUND);
        return quiz;
    }

    async create(data) {
        console.log("in service", data);
        return quizRepository.create(data);
    }

    async update(id, data) {
        const quiz = await this.getById(id);
        return quizRepository.update(quiz.id, data);
    }

    async delete(id) {
        const quiz = await this.getById(id);
    }
}

module.exports = QuizService;