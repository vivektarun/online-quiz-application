const { sequelize } = require('./models');

// Import repositories responsible for data access
const { 
    QuizRepository, 
    QuestionRepository, 
    AnswerRepository,
    SubmissionRepository,
    SubmissionAnswerRepository  
} = require('./repositories');

// Import services containing business logic
const { 
    QuizService,
    QuestionService,
    SubmissionService
} = require('./services');

// Import controllers to handle incoming requests and responses
const { 
    QuizController,
    QuestionController,
    SubmissionController
} = require('./controllers');

// Instantiate repositories
const quizRepository = new QuizRepository();
const questionRepository = new QuestionRepository();
const answerRepository = new AnswerRepository();
const submissionRepository = new SubmissionRepository();
const submissionAnswerRepository = new SubmissionAnswerRepository();

// Instantiate services, injecting repositories and sequelize (for transaction management)
const quizService = new QuizService(quizRepository);
const questionService = new QuestionService(questionRepository, answerRepository, sequelize);
const submissionService = new SubmissionService(
    questionRepository,
    answerRepository,
    submissionRepository,
    submissionAnswerRepository,
    sequelize
);

// Instantiate controllers, injecting the respective services
const quizController = new QuizController(quizService);
const questionController = new QuestionController(questionService);
const submissionController = new SubmissionController(submissionService);

// Export controllers for use in routing layer
module.exports = {
    quizController,
    questionController,
    submissionController
};