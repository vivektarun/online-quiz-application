const { sequelize } = require('../models');
const { AppError } = require('../utils/errors');
const {
    scoreTextQuestion,
    scoreSingleChoiceQuestion,
    scoreMultipleChoiceQuestion,
} = require('../utils/common/submissionUtils');

const { StatusCodes } = require('http-status-codes');

const { Enums } = require('../utils/common');
const { SINGLE_CHOICE, MULTIPLE_CHOICE, TEXT } = Enums.QUESTION_TYPE;

class SubmissionService {
    constructor(questionRepository, answerRepository, submissionRepository, submissionAnswerRepository) {
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.submissionRepository = submissionRepository;
        this.submissionAnswerRepository = submissionAnswerRepository;
    }

    async createSubmission(data) {
        const transaction = await sequelize.transaction();
        try {
            const questionIds = data.answers.map(a => a.questionId);
            let quizQuestions = await this.questionRepository.findQuestionsWithAnswers(data.quizId, questionIds);
            quizQuestions = quizQuestions.map(q => q.toJSON());

            const submission = await this.submissionRepository.create({
                quizId: data.quizId,
                score: 0,
                total: 0,
            }, { transaction });

            let totalScore = 0;
            let obtainedScore = 0;
            const submissionAnswerRecords = [];

            for (const userAnswer of data.answers) {
                const question = quizQuestions.find(q => q.id === userAnswer.questionId);
                if (!question) {
                    throw new AppError(`Question ${userAnswer.questionId} not found for quiz`, StatusCodes.BAD_REQUEST);
                }
                totalScore += parseFloat(question.points);

                let result;
                switch (question.type) {
                    case TEXT:
                        result = scoreTextQuestion(question, userAnswer, submission.id);
                        break;
                    case SINGLE_CHOICE:
                        result = scoreSingleChoiceQuestion(question, userAnswer, submission.id);
                        break;
                    case MULTIPLE_CHOICE:
                        result = scoreMultipleChoiceQuestion(question, userAnswer, submission.id);
                        break;
                    default:
                        throw new AppError(`Unsupported question type: ${question.type}`, StatusCodes.BAD_REQUEST);
                }

                obtainedScore += result.score;
                submissionAnswerRecords.push(...result.submissionAnswers);
            }

            // Bulk insert all submission answers
            await this.submissionAnswerRepository.bulkCreate(submissionAnswerRecords, transaction);

            submission.score = obtainedScore;
            submission.total = totalScore;
            await submission.save({ transaction });

            await transaction.commit();

            return {
                quizId: submission.quizId,
                totalScore: submission.total,
                ScoreObtained: submission.score,
            };
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
}

module.exports = SubmissionService;
