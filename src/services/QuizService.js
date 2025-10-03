const { StatusCodes } = require('http-status-codes');
const { errors } = require('../utils');
const { AppError } = errors;

/**
 * Service class to handle business logic related to quizzes
 */
class QuizService {
    constructor(quizRepository) {
        this.quizRepository = quizRepository;  // Injected repository for data access
    }

    /**
     * Fetch all quizzes from the repository
     * @returns {Array} - List of all quizzes
     */
    async getAll() {
        return this.quizRepository.getAll();
    }

    /**
     * Fetch a quiz by its ID
     * Throws a 404 error if quiz not found
     * @param {number} id - Quiz ID
     * @returns {Object} - Quiz object
     */
    async getById(id) {
        const quiz = await this.quizRepository.findById(id);
        if (!quiz) throw new AppError('Quiz not found', StatusCodes.NOT_FOUND);
        return quiz;
    }

    /**
     * Create a new quiz with provided data
     * @param {Object} data - Quiz data
     * @returns {Object} - Created quiz
     */
    async create(data) {
        return this.quizRepository.create(data);
    }

    /**
     * Update an existing quiz by ID with new data
     * Validates existence before update
     * @param {number} id - Quiz ID
     * @param {Object} data - Updated quiz data
     * @returns {Object} - Updated quiz object
     */
    async update(id, data) {
        const quiz = await this.getById(id); // Ensure quiz exists
        return this.quizRepository.update(quiz.id, data);
    }

    /**
     * Delete a quiz by ID after validating existence
     * @param {number} id - Quiz ID
     */
    async delete(id) {
        await this.getById(id); // Ensure quiz exists
        return this.quizRepository.destroy(id);
    }
}

module.exports = QuizService;
