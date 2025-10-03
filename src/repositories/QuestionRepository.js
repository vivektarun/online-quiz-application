const CrudRepository = require("./CrudRepository");
const { Question, Answer } = require('../models');

/**
 * Repository class for question-related database operations
 * Extends generic CRUD repository and adds custom queries with answer associations
 */
class QuestionRepository extends CrudRepository {
    constructor() {
        super(Question);  // Initialize with the Question model
    }

    /**
     * Fetch all questions with their associated answers optionally filtered by quizId
     * @param {number} quizId - Optional quiz ID to filter questions
     * @returns {Array} List of questions with included answers (id and text)
     */
    async findAllWithAnswersByQuizId(quizId) {
        const whereClause = {};
        if (quizId) whereClause.quizId = quizId;

        return await this.model.findAll({
            where: whereClause,
            include: [
                {
                    model: Answer,
                    as: 'answers',
                    attributes: ['id', 'text'],  // Include only ID and text fields in answers
                },
            ],
            order: [
                ['id', 'ASC'],  // Order questions by ID ascending
                [{ model: Answer, as: 'answers' }, 'id', 'ASC'],  // Order answers by ID ascending
            ],
        });
    }

    /**
     * Fetch a single question by ID with its answers included
     * Typically used after question creation to retrieve full details
     * @param {number} id - Question ID
     * @param {Object} transaction - Optional Sequelize transaction to use
     * @returns {Object} Question instance with answers (id, text, isCorrect)
     */
    async findByIdWithAnswers(id, transaction = null) {
        return await this.model.findByPk(id, {
            include: [
                {
                    model: Answer,
                    as: 'answers',
                    attributes: ['id', 'text', 'isCorrect'],
                },
            ],
            transaction
        });
    }

    /**
     * Fetch questions with answers filtered by quizId and multiple question IDs
     * Useful for fetching a subset of quiz questions
     * @param {number} quizId - Quiz ID
     * @param {Array<number>} questionIds - Array of question IDs to filter
     * @returns {Array} Questions with included answers (id, text, isCorrect)
     */
    async findQuestionsWithAnswers(quizId, questionIds) {
        return await this.model.findAll({
            where: {
                quizId,
                id: questionIds
            },
            include: [
                {
                    model: Answer,
                    as: 'answers',
                    attributes: ['id', 'text', 'isCorrect'],
                }
            ],
            order: [
                ['id', 'ASC'],
                [{ model: Answer, as: 'answers' }, 'id', 'ASC'],
            ],
        });
    }
}

module.exports = QuestionRepository;
