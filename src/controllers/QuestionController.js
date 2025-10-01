const { StatusCodes } = require("http-status-codes");
const { responseHandler } = require("../utils/common");

class QuestionController {
    constructor(questionService) {
        this.questionService = questionService;
        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
    }

    async create(req, res, next) {
        try {
            const question = await this.questionService.createQuestionWithAnswer(req.body);
            responseHandler.successResponse(res, 'Question created successfully', question, StatusCodes.CREATED);
        } catch (err) {
            next(err);
        }
    } 

    async getAll(req, res, next) {
        try {
            console.log("inside controller")
            const quizId = req.query.quizId ? parseInt(req.query.quizId, 10): undefined;
            const questions = await this.questionService.getAllQuestionsWithAnswers(quizId);

            //Filter out answers for text type questions
            const sanitizedQuestions = questions.map(q => {
                const question = q.toJSON();
                if(question.type === 'text') {
                    delete question.answers; // Remove answers array completly
                }
                return question;
            });
            responseHandler.successResponse(res, 'Questions with answers fetched successfully', sanitizedQuestions, StatusCodes.OK);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = QuestionController;