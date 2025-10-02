const CrudRepository = require("./CrudRepository");
const { Question, Answer } = require('../models');

class QuestionRepository extends CrudRepository {
    constructor() {
        super(Question);
    }

    // Encapsulate fetching questions with their answers by quizId
    async findAllWithAnswersByQuizId(quizId) {
        const whereClause = {};
        if (quizId) whereClause.quizId = quizId;

        return await this.model.findAll({
            where: whereClause,
            include: [
                {
                    model: Answer,
                    as: 'answers',
                    attributes: ['id', 'text'],
                },
            ],
            order: [
                ['id', 'ASC'],
                [{ model: Answer, as: 'answers' }, 'id', 'ASC'],
            ],
        });
    }

    // Fetch single question with answers by id (used after creation)
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
}

module.exports = QuestionRepository;
