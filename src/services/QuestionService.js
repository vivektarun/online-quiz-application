class QuestionService {
    constructor(questionRepository, answerRepository, sequelize) {
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.sequelize = sequelize;
    }

    async createQuestionWithAnswer(data) {
        const transaction = await this.sequelize.transaction();
        try {
            // Create question
            const question = await this.questionRepository.create({
                quizId: data.quizId,
                text: data.text,
                type: data.type,
                points: data.points,
                negativePoints: data.negativePoints || 0
            }, { transaction });

            // Create all answers in a loop with transaction
            for (const answer of data.answers) {
                await this.answerRepository.create({
                    questionId: question.id,
                    text: answer.text,
                    isCorrect: answer.isCorrect || false
                }, { transaction });
            }

            // Fetch created question with its answers
            const result = await this.questionRepository.findByIdWithAnswers(question.id, transaction);

            await transaction.commit();
            return result;
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    async getAllQuestionsWithAnswers(quizId) {
        return this.questionRepository.findAllWithAnswersByQuizId(quizId);
    }
}

module.exports = QuestionService;