class QuestionService {
    constructor(questionRepository, answerRepository, sequelize) {
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.sequelize = sequelize;
    }

    /**
     * Create a new question along with its associated answers.
     * Uses a transaction to ensure atomicity of question and answer creation.
     * 
     * @param {Object} data - Contains quizId, text, type, points, negativePoints, and answers array
     * @returns {Object} - The newly created question with its answers
     */
    async createQuestionWithAnswer(data) {
        // Start a database transaction
        const transaction = await this.sequelize.transaction();

        try {
            // Create question record within the transaction
            const question = await this.questionRepository.create({
                quizId: data.quizId,
                text: data.text,
                type: data.type,
                points: data.points,
                negativePoints: data.negativePoints || 0 // default to 0 if not provided
            }, { transaction });

            // Create all answers associated with the question within the transaction
            for (const answer of data.answers) {
                await this.answerRepository.create({
                    questionId: question.id,
                    text: answer.text,
                    isCorrect: answer.isCorrect || false
                }, { transaction });
            }

            // Fetch the newly created question together with its answers in the same transaction
            const result = await this.questionRepository.findByIdWithAnswers(question.id, transaction);

            // Commit the transaction to persist all changes
            await transaction.commit();

            // Return combined question and answer data
            return result;
        } catch (err) {
            // Roll back the transaction if any error occurs
            await transaction.rollback();
            throw err;
        }
    }

    /**
     * Retrieve all questions with their answers, optionally filtered by quizId
     * 
     * @param {number} quizId - Optional quiz ID to filter questions
     * @returns {Array} - List of questions with their associated answers
     */
    async getAllQuestionsWithAnswers(quizId) {
        return this.questionRepository.findAllWithAnswersByQuizId(quizId);
    }
}

module.exports = QuestionService;
