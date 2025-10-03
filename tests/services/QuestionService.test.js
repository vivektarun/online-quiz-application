const { QuestionService } = require('../../src/services');

describe('QuestionService', () => {
  let questionRepositoryMock;
  let answerRepositoryMock;
  let sequelizeMock;
  let transactionMock;
  let questionService;

  beforeEach(() => {
    // Mock repositories
    questionRepositoryMock = {
      create: jest.fn(),
      findByIdWithAnswers: jest.fn(),
      findAllWithAnswersByQuizId: jest.fn(),
    };
    answerRepositoryMock = {
      create: jest.fn(),
    };

    // Mock sequelize transaction
    transactionMock = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };
    sequelizeMock = {
      transaction: jest.fn().mockResolvedValue(transactionMock),
    };

    // Instantiate service with mocks
    questionService = new QuestionService(
      questionRepositoryMock,
      answerRepositoryMock,
      sequelizeMock
    );
  });

  describe('createQuestionWithAnswer', () => {
    const inputData = {
      quizId: 1,
      text: 'Sample question?',
      type: 'single_choice',
      points: 5,
      negativePoints: 2,
      answers: [
        { text: 'Answer 1', isCorrect: true },
        { text: 'Answer 2', isCorrect: false }
      ],
    };

    it('should create a question and its answers in a transaction and return full question with answers', async () => {
      // Arrange: mock behavior
      const createdQuestion = { id: 10 };
      questionRepositoryMock.create.mockResolvedValue(createdQuestion);
      answerRepositoryMock.create.mockResolvedValue({});
      questionRepositoryMock.findByIdWithAnswers.mockResolvedValue({
        id: 10,
        text: 'Sample question?',
        answers: [
          { id: 100, text: 'Answer 1', isCorrect: true },
          { id: 101, text: 'Answer 2', isCorrect: false }
        ]
      });

      // Act
      const result = await questionService.createQuestionWithAnswer(inputData);

      // Assert
      expect(sequelizeMock.transaction).toHaveBeenCalled();
      expect(questionRepositoryMock.create).toHaveBeenCalledWith({
        quizId: inputData.quizId,
        text: inputData.text,
        type: inputData.type,
        points: inputData.points,
        negativePoints: inputData.negativePoints,
      }, { transaction: transactionMock });

      expect(answerRepositoryMock.create).toHaveBeenCalledTimes(inputData.answers.length);
      for (let i = 0; i < inputData.answers.length; i++) {
        expect(answerRepositoryMock.create).toHaveBeenCalledWith({
          questionId: createdQuestion.id,
          text: inputData.answers[i].text,
          isCorrect: inputData.answers[i].isCorrect
        }, { transaction: transactionMock });
      }

      expect(questionRepositoryMock.findByIdWithAnswers).toHaveBeenCalledWith(createdQuestion.id, transactionMock);
      expect(transactionMock.commit).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 10);
      expect(result).toHaveProperty('answers');
      expect(transactionMock.rollback).not.toHaveBeenCalled();
    });

    it('should rollback transaction on error and throw', async () => {
      // Arrange: throw error during question creation
      const error = new Error('DB error');
      questionRepositoryMock.create.mockRejectedValue(error);

      // Act & Assert
      await expect(questionService.createQuestionWithAnswer(inputData)).rejects.toThrow(error);
      expect(transactionMock.rollback).toHaveBeenCalled();
      expect(transactionMock.commit).not.toHaveBeenCalled();
    });
  });

  describe('getAllQuestionsWithAnswers', () => {
    it('should fetch all questions with answers filtered by quizId', async () => {
      // Arrange
      const quizId = 1;
      const questions = [{ id: 1, text: 'Q1' }, { id: 2, text: 'Q2' }];
      questionRepositoryMock.findAllWithAnswersByQuizId.mockResolvedValue(questions);

      // Act
      const result = await questionService.getAllQuestionsWithAnswers(quizId);

      // Assert
      expect(questionRepositoryMock.findAllWithAnswersByQuizId).toHaveBeenCalledWith(quizId);
      expect(result).toEqual(questions);
    });

    it('should fetch all questions with answers when quizId is undefined', async () => {
      // Arrange
      const questions = [{ id: 1, text: 'Q1' }, { id: 2, text: 'Q2' }];
      questionRepositoryMock.findAllWithAnswersByQuizId.mockResolvedValue(questions);

      // Act
      const result = await questionService.getAllQuestionsWithAnswers();

      // Assert
      expect(questionRepositoryMock.findAllWithAnswersByQuizId).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(questions);
    });
  });

  describe('createQuestionWithAnswer - additional tests', () => {
  it('should create question with empty answers array (answers length 0)', async () => {
    const inputData = {
      quizId: 1,
      text: 'Question with no answers',
      type: 'text',
      points: 5,
      answers: [], // empty answers array case
    };
    questionRepositoryMock.create.mockResolvedValue({ id: 1 });
    questionRepositoryMock.findByIdWithAnswers.mockResolvedValue({
      id: 1,
      text: 'Question with no answers',
      answers: []
    });

    const result = await questionService.createQuestionWithAnswer(inputData);

    expect(answerRepositoryMock.create).not.toHaveBeenCalled();
    expect(transactionMock.commit).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  it('should handle undefined negativePoints as 0 by default', async () => {
    const inputData = {
      quizId: 2,
      text: 'Question without negativePoints',
      type: 'single_choice',
      points: 10,
      answers: [{ text: 'Answer 1', isCorrect: true }],
    };
    questionRepositoryMock.create.mockImplementation(data => {
      expect(data.negativePoints).toBe(0);
      return Promise.resolve({ id: 5 });
    });
    questionRepositoryMock.findByIdWithAnswers.mockResolvedValue({
      id: 5,
      text: inputData.text,
      answers: inputData.answers
    });
    answerRepositoryMock.create.mockResolvedValue({});

    await questionService.createQuestionWithAnswer(inputData);
    expect(transactionMock.commit).toHaveBeenCalled();
  });

  it('should rollback if creating an answer fails', async () => {
    const inputData = {
      quizId: 1,
      text: 'Question with answer creation error',
      type: 'single_choice',
      points: 3,
      negativePoints: 1,
      answers: [
        { text: 'Answer 1', isCorrect: true },
        { text: 'Answer 2', isCorrect: false }
      ],
    };

    questionRepositoryMock.create.mockResolvedValue({ id: 1 });
    answerRepositoryMock.create.mockRejectedValue(new Error('Answer creation failed'));
  
    await expect(questionService.createQuestionWithAnswer(inputData)).rejects.toThrow('Answer creation failed');
    expect(transactionMock.rollback).toHaveBeenCalled();
    expect(transactionMock.commit).not.toHaveBeenCalled();
  });

  it('should rollback if fetching created question with answers fails', async () => {
    const inputData = {
      quizId: 1,
      text: 'Question with fetch error',
      type: 'single_choice',
      points: 4,
      negativePoints: 0,
      answers: [{ text: 'Answer 1', isCorrect: true }],
    };

    questionRepositoryMock.create.mockResolvedValue({ id: 1 });
    answerRepositoryMock.create.mockResolvedValue({});
    questionRepositoryMock.findByIdWithAnswers.mockRejectedValue(new Error('DB fetch error'));

    await expect(questionService.createQuestionWithAnswer(inputData)).rejects.toThrow('DB fetch error');
    expect(transactionMock.rollback).toHaveBeenCalled();
    expect(transactionMock.commit).not.toHaveBeenCalled();
  });

  it('should throw error if quizId is missing in createQuestionWithAnswer data', async () => {
    const inputData = {
      text: 'Missing quizId',
      type: 'single_choice',
      points: 5,
      answers: [{ text: 'Answer 1', isCorrect: true }],
    };

    questionRepositoryMock.create.mockRejectedValue(new Error('notNull Violation: quizId'));

    await expect(questionService.createQuestionWithAnswer(inputData)).rejects.toThrow('notNull Violation');
    expect(transactionMock.rollback).toHaveBeenCalled();
  });
});


});
