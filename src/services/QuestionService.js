const { StatusCodes } = require('http-status-codes');
const { sequelize } = require('../models');
const { QuestionRepository, AnswerRepository } = require('../repositories');
const { AppError } = require('../utils/errors');
const { Enums } = require('../utils/common');
const { SINGLE_CHOICE, MULTIPLE_CHOICE, TEXT } = Enums.QUESTION_TYPE;

const questionRepository = new QuestionRepository();
const answerRepository = new AnswerRepository();

class QuestionService {
    async createQuestionWithAnswer(data) {
        console.log(data);
        const transaction = await sequelize.transaction();
        try {
            if (!data.quizId) throw new AppError('quizId is required', StatusCodes.BAD_REQUEST);
            if (!data.text) throw new AppError('Question text is required', StatusCodes.BAD_REQUEST);
            if (!data.type) throw new AppError('Question type is required', StatusCodes.BAD_REQUEST);

            const validTypes = [SINGLE_CHOICE, MULTIPLE_CHOICE, TEXT];

            if (!validTypes.includes(data.type)) {
                throw new AppError(`Invalid question type: ${data.type}`, StatusCodes.BAD_REQUEST);
            }

            if (validTypes.includes(data.type)) {
                if (!Array.isArray(data.answers) || data.answers.length === 0) {
                    throw new AppError('Answers are required for this question type', StatusCodes.BAD_REQUEST);
                }
                const correctCount = data.answers.filter(a => a.isCorrect === true).length;
                if (correctCount === 0) {
                    throw new AppError('At least one answer must be correct', StatusCodes.BAD_REQUEST);
                }
            }

            const question = await questionRepository.create({
                quizId: data.quizId,
                text: data.text,
                type: data.type,
                points: data.points,
                negativePoints: data.negativePoints || 0
            }, { transaction });

            for (const answer of data.answers) {
                await answerRepository.create({
                    questionId: question.id,
                    text: answer.text,
                    isCorrect: answer.isCorrect || false
                }, { transaction });
            }

            return await questionRepository.model.findByPk(question.id, {
                include: [{
                    model: answerRepository.model,
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
        if (quizId) whereClause.quizId = quizId;

        return await questionRepository.model.findAll({
            where: whereClause,
            include: [
                {
                    model: answerRepository.model,
                    as: 'answers',
                    attributes: ['id', 'text'],
                },
            ],
            order: [
                ['id', 'ASC'],
                [{ model: answerRepository.model, as: 'answers' }, 'id', 'ASC'],
            ],
        });
    }
}

module.exports = QuestionService;