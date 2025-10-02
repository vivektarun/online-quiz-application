const { StatusCodes } = require('http-status-codes');
const { sequelize } = require('../models');
const { AppError } = require('../utils/errors');
const { Enums } = require('../utils/common');
const { SINGLE_CHOICE, MULTIPLE_CHOICE, TEXT } = Enums.QUESTION_TYPE;

class QuestionService {
    constructor(questionRepository, answerRepository) {
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
    }

    async createQuestionWithAnswer(data) {
        const transaction = await sequelize.transaction();
        try {
            const question = await this.questionRepository.create({
                quizId: data.quizId,
                text: data.text,
                type: data.type,
                points: data.points,
                negativePoints: data.negativePoints || 0
            }, { transaction });

            for (const answer of data.answers) {
                await this.answerRepository.create({
                    questionId: question.id,
                    text: answer.text,
                    isCorrect: answer.isCorrect || false
                }, { transaction });
            }

            return await this.questionRepository.model.findByPk(question.id, {
                include: [{
                    model: this.answerRepository.model,
                    as: 'answers',
                    attributes: ['id', 'text', 'isCorrect']
                }]
            })
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    async getAllQuestionsWithAnswers(quizId) {
        const whereClause = {};

        if(quizId) whereClause.quizId = quizId;

        return await this.questionRepository.model.findAll({
            where: whereClause,
            include: [
                {
                    model: this.answerRepository.model,
                    as: 'answers',
                    attributes: ['id', 'text'],
                },
            ],
            order: [
                ['id', 'ASC'],
                [{ model: this.answerRepository.model, as: 'answers' }, 'id', 'ASC'],
            ],
        });
    }
}

module.exports = QuestionService;