const { QuizService } = require('../../src/services');
const { AppError } = require('../../src/utils/errors');
const { StatusCodes } = require('http-status-codes');

describe('QuizService', () => {
    let mockQuizRepository;
    let quizService;

    beforeEach(() => {
        mockQuizRepository = {
            getAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
        };

        quizService = new QuizService(mockQuizRepository);
    });

    test('getById returns quiz if found', async () => {
        const quiz = { id: 1, title: 'Sample Quiz' };
        mockQuizRepository.findById.mockResolvedValue(quiz);

        const result = await quizService.getById(1);

        expect(result).toEqual(quiz);
        expect(mockQuizRepository.findById).toHaveBeenCalledWith(1);
    });

    test('getById throws error if quiz not found', async () => {
        mockQuizRepository.findById.mockResolvedValue(null);

        await expect(quizService.getById(999)).rejects.toThrow(AppError);
        await expect(quizService.getById(999)).rejects.toThrow('Quiz not found');
    });

    test('create successfully creates quiz', async () => {
        const inputData = { title: 'New Quiz' };
        const createdQuiz = { id: 1, ...inputData };
        mockQuizRepository.create.mockResolvedValue(createdQuiz);

        const result = await quizService.create(inputData);

        expect(result).toEqual(createdQuiz);
        expect(mockQuizRepository.create).toHaveBeenCalledWith(inputData);
    });

    test('update successfully updates an existing quiz', async () => {
        const quizId = 1;
        const updateData = { title: 'Updated Title' };
        const existingQuiz = { id: quizId, title: 'Old Title' };

        mockQuizRepository.findById.mockResolvedValue(existingQuiz);
        mockQuizRepository.update.mockResolvedValue([1]); // Sequelize returns affected rows

        const result = await quizService.update(quizId, updateData);

        expect(mockQuizRepository.findById).toHaveBeenCalledWith(quizId);
        expect(mockQuizRepository.update).toHaveBeenCalledWith(quizId, updateData);
        expect(result).toEqual([1]);
    });

    test('update throws error if quiz does not exist', async () => {
        mockQuizRepository.findById.mockResolvedValue(null);

        await expect(quizService.update(1, { title: 'Test' })).rejects.toThrow(AppError);
    });

    test('delete successfully removes an existing quiz', async () => {
        const quizId = 1;
        const existingQuiz = { id: quizId, title: 'To be deleted' };

        mockQuizRepository.findById.mockResolvedValue(existingQuiz);
        mockQuizRepository.destroy.mockResolvedValue(1);  // number of rows deleted

        const result = await quizService.delete(quizId);

        expect(mockQuizRepository.findById).toHaveBeenCalledWith(quizId);
        expect(mockQuizRepository.destroy).toHaveBeenCalledWith(quizId);
        expect(result).toEqual(1);
    });

    test('delete throws error if quiz does not exist', async () => {
        mockQuizRepository.findById.mockResolvedValue(null);

        await expect(quizService.delete(999)).rejects.toThrow(AppError);
    });
});
