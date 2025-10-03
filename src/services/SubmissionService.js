const { AppError } = require('../utils/errors');
const {
    scoreTextQuestion,
    scoreSingleChoiceQuestion,
    scoreMultipleChoiceQuestion,
} = require('../utils/common/submissionUtils');

const { StatusCodes } = require('http-status-codes');

const { Enums } = require('../utils/common');
const { SINGLE_CHOICE, MULTIPLE_CHOICE, TEXT } = Enums.QUESTION_TYPE;

/**
 * Service class to handle submission-related business logic
 */
class SubmissionService {
    constructor(questionRepository, answerRepository, submissionRepository, submissionAnswerRepository, sequelize) {
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.submissionRepository = submissionRepository;
        this.submissionAnswerRepository = submissionAnswerRepository;
        this.sequelize = sequelize;
    }

    /**
     * Create a new submission along with scoring and recording answers
     * Uses a transaction to ensure atomicity of all related operations
     * @param {Object} data - Contains quizId and answers array (user responses)
     * @returns {Object} - Summary of quiz ID, total possible score, and score obtained
     */
    async createSubmission(data) {
        // Start a database transaction
        const transaction = await this.sequelize.transaction();

        try {
            // Extract question IDs from user's answers
            const questionIds = data.answers.map(a => a.questionId);

            // Fetch quiz questions with their answers filtered by quizId and questionIds
            let quizQuestions = await this.questionRepository.findQuestionsWithAnswers(data.quizId, questionIds);

            // Convert Sequelize models to plain objects
            quizQuestions = quizQuestions.map(q => q.toJSON());

            // Create a submission record with initial score and total set to 0
            const submission = await this.submissionRepository.create({
                quizId: data.quizId,
                score: 0,
                total: 0,
            }, { transaction });

            let totalScore = 0;      // Sum of max possible points for questions answered
            let obtainedScore = 0;   // Accumulated score from user's answers
            const submissionAnswerRecords = [];  // To hold answer records for bulk insertion

            // Process each user answer: find corresponding question and score it accordingly
            for (const userAnswer of data.answers) {
                // Find question data corresponding to the user answer
                const question = quizQuestions.find(q => q.id === userAnswer.questionId);

                // Throw error if question not found in the quiz context
                if (!question) {
                    throw new AppError(`Question ${userAnswer.questionId} not found for quiz`, StatusCodes.BAD_REQUEST);
                }

                // Add question's point value to total possible score
                totalScore += parseFloat(question.points);

                let result;

                // Choose appropriate scoring function based on question type
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

                // Accumulate obtained score from the scored result
                obtainedScore += result.score;

                // Append submission answer records to batch array
                submissionAnswerRecords.push(...result.submissionAnswers);
            }

            // Bulk insert submission answer records into DB as a single operation within transaction
            await this.submissionAnswerRepository.bulkCreate(submissionAnswerRecords, transaction);

            // Update submission record with final scores
            submission.score = obtainedScore;
            submission.total = totalScore;

            // Save updated submission record within transaction
            await submission.save({ transaction });

            // Commit transaction to make all changes permanent
            await transaction.commit();

            // Return summary of submission scoring
            return {
                quizId: submission.quizId,
                totalScore: submission.total,
                ScoreObtained: submission.score,
            };

        } catch (err) {
            // Rollback transaction if anything goes wrong
            await transaction.rollback();
            throw err;
        }
    }
}

module.exports = SubmissionService;
