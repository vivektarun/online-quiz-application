const { 
    QuizRepository, 
    QuestionRepository, 
    AnswerRepository,
    SubmissionRepository,
    SubmissionAnswerRepository  
} = require('./repositories');
const { 
    QuizService,
    QuestionService,
    SubmissionService
} = require('./services');
const { 
    QuizController,
    QuestionController,
    SubmissionController
} = require('./controllers')

const quizRepository = new QuizRepository();
const quizService = new QuizService(quizRepository);
const quizController = new QuizController(quizService);

const questionRepository = new QuestionRepository();
const answerRepository = new AnswerRepository();

const questionService = new QuestionService(questionRepository, answerRepository);
const questionController = new QuestionController(questionService);

const submissionRepository = new SubmissionRepository();
const submissionAnswerRepository = new SubmissionAnswerRepository();

const submissionService = new SubmissionService(
    questionRepository,
    answerRepository,
    submissionRepository,
    submissionAnswerRepository
);``

const submissionController = new SubmissionController(submissionService);

module.exports = {
    quizController,
    questionController,
    submissionController
};