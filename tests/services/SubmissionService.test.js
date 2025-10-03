const { SubmissionService } = require('../../src/services/');
const { AppError } = require('../../src/utils/errors');


// Mocks for scoring utilities
const {
    scoreTextQuestion,
    scoreSingleChoiceQuestion,
    scoreMultipleChoiceQuestion,
} = require('../../src/utils/common/submissionUtils');

jest.mock('../../src/utils/common/submissionUtils');

describe('SubmissionService', () => {
    let questionRepositoryMock;
    let answerRepositoryMock; // Not used here but required by constructor
    let submissionRepositoryMock;
    let submissionAnswerRepositoryMock;
    let sequelizeMock;
    let transactionMock;
    let submissionService;

    beforeEach(() => {
        questionRepositoryMock = {
            findQuestionsWithAnswers: jest.fn(),
        };
        answerRepositoryMock = {};

        submissionRepositoryMock = {
            create: jest.fn(),
        };
        submissionAnswerRepositoryMock = {
            bulkCreate: jest.fn(),
        };

        transactionMock = {
            commit: jest.fn(),
            rollback: jest.fn(),
        };
        sequelizeMock = {
            transaction: jest.fn().mockResolvedValue(transactionMock),
        };

        submissionService = new SubmissionService(
            questionRepositoryMock,
            answerRepositoryMock,
            submissionRepositoryMock,
            submissionAnswerRepositoryMock,
            sequelizeMock
        );

        // Reset mocks for scoring functions
        scoreTextQuestion.mockReset();
        scoreSingleChoiceQuestion.mockReset();
        scoreMultipleChoiceQuestion.mockReset();
    });

    // Positive Tests

    it('should create submission and score text, single, multiple choice questions correctly', async () => {
        const inputData = {
            quizId: 1,
            answers: [
                { questionId: 101, textAnswer: 'answer text' },
                { questionId: 102, selectedAnswerId: 201 },
                { questionId: 103, selectedAnswerId: [301, 302] },
            ],
        };

        questionRepositoryMock.findQuestionsWithAnswers.mockResolvedValue([
            { id: 101, type: 'text', points: 5, negativePoints: 1, toJSON: () => ({ id: 101, type: 'text', points: 5, negativePoints: 1 }) },
            { id: 102, type: 'single_choice', points: 3, negativePoints: 1, toJSON: () => ({ id: 102, type: 'single_choice', points: 3, negativePoints: 1 }) },
            { id: 103, type: 'multiple_choice', points: 10, negativePoints: 2, toJSON: () => ({ id: 103, type: 'multiple_choice', points: 10, negativePoints: 2 }) },
        ]);

        // Prepare mock submission with jest.fn() save method
        const mockSubmission = {
            id: 500,
            quizId: 1,
            score: 0,
            total: 0,
            save: jest.fn(),
        };

        submissionRepositoryMock.create.mockResolvedValue(mockSubmission);

        scoreTextQuestion.mockReturnValue({
            score: 5,
            submissionAnswers: [{ submissionId: 500, questionId: 101, textAnswer: 'answer text', selectedAnswerId: null, score: 5 }],
        });
        scoreSingleChoiceQuestion.mockReturnValue({
            score: 3,
            submissionAnswers: [{ submissionId: 500, questionId: 102, textAnswer: null, selectedAnswerId: 201, score: 3 }],
        });
        scoreMultipleChoiceQuestion.mockReturnValue({
            score: 8,
            submissionAnswers: [
                { submissionId: 500, questionId: 103, textAnswer: null, selectedAnswerId: 301, score: 8 },
                { submissionId: 500, questionId: 103, textAnswer: null, selectedAnswerId: 302, score: 0 },
            ],
        });

        const result = await submissionService.createSubmission(inputData);

        expect(sequelizeMock.transaction).toHaveBeenCalled();
        expect(submissionRepositoryMock.create).toHaveBeenCalledWith(
            { quizId: 1, score: 0, total: 0 },
            { transaction: transactionMock }
        );
        expect(submissionAnswerRepositoryMock.bulkCreate).toHaveBeenCalled();

        expect(result).toEqual({
            quizId: 1,
            totalScore: 18,
            ScoreObtained: 16,
        });

        // Assert on mockSubmission.save instead of submissionRepositoryMock.create().save
        expect(mockSubmission.save).toHaveBeenCalledWith({ transaction: transactionMock });

        expect(transactionMock.commit).toHaveBeenCalled();
        expect(transactionMock.rollback).not.toHaveBeenCalled();
    });


    it('should handle empty answers array without error and return zero scores', async () => {
        const inputData = { quizId: 1, answers: [] };

        questionRepositoryMock.findQuestionsWithAnswers.mockResolvedValue([]);
        submissionRepositoryMock.create.mockResolvedValue({
            id: 501,
            quizId: 1,
            score: 0,
            total: 0,
            save: jest.fn(),
        });

        const result = await submissionService.createSubmission(inputData);

        expect(result).toEqual({
            quizId: 1,
            totalScore: 0,
            ScoreObtained: 0,
        });
        expect(transactionMock.commit).toHaveBeenCalled();
    });

    // Negative Tests

    it('should throw error and rollback if a question in answer not found in quiz questions', async () => {
        const inputData = {
            quizId: 1,
            answers: [{ questionId: 999, selectedAnswerId: 1 }],
        };

        questionRepositoryMock.findQuestionsWithAnswers.mockResolvedValue([
            { id: 1, type: 'single_choice', points: 1, negativePoints: 0, toJSON: () => ({ id: 1, type: 'single_choice', points: 1, negativePoints: 0 }) },
        ]);
        submissionRepositoryMock.create.mockResolvedValue({
            id: 502,
            quizId: 1,
            score: 0,
            total: 0,
            save: jest.fn(),
        });

        await expect(submissionService.createSubmission(inputData)).rejects.toThrow(AppError);
        expect(transactionMock.rollback).toHaveBeenCalled();
        expect(transactionMock.commit).not.toHaveBeenCalled();
    });

    it('should throw error and rollback on unsupported question type', async () => {
        const inputData = {
            quizId: 1,
            answers: [{ questionId: 1, selectedAnswerId: 1 }],
        };

        questionRepositoryMock.findQuestionsWithAnswers.mockResolvedValue([
            { id: 1, type: 'unsupported_type', points: 2, negativePoints: 0, toJSON: () => ({ id: 1, type: 'unsupported_type', points: 2, negativePoints: 0 }) },
        ]);
        submissionRepositoryMock.create.mockResolvedValue({
            id: 503,
            quizId: 1,
            score: 0,
            total: 0,
            save: jest.fn(),
        });

        await expect(submissionService.createSubmission(inputData)).rejects.toThrow(AppError);
        expect(transactionMock.rollback).toHaveBeenCalled();
    });

    it('should rollback and propagate error when submission creation fails', async () => {
        const inputData = {
            quizId: 1,
            answers: [],
        };

        questionRepositoryMock.findQuestionsWithAnswers.mockResolvedValue([]);
        submissionRepositoryMock.create.mockRejectedValue(new Error('Create submission failed'));

        await expect(submissionService.createSubmission(inputData)).rejects.toThrow('Create submission failed');
        expect(transactionMock.rollback).toHaveBeenCalled();
    });

    it('should rollback and propagate error when bulkCreate submission answers fails', async () => {
        const inputData = {
            quizId: 1,
            answers: [{ questionId: 1, selectedAnswerId: 2 }],
        };

        questionRepositoryMock.findQuestionsWithAnswers.mockResolvedValue([
            { id: 1, type: 'single_choice', points: 5, negativePoints: 1, toJSON: () => ({ id: 1, type: 'single_choice', points: 5, negativePoints: 1 }) },
        ]);
        submissionRepositoryMock.create.mockResolvedValue({
            id: 504,
            quizId: 1,
            score: 0,
            total: 0,
            save: jest.fn(),
        });

        scoreSingleChoiceQuestion.mockReturnValue({
            score: 5,
            submissionAnswers: [{ submissionId: 504, questionId: 1, selectedAnswerId: 2, textAnswer: null, score: 5 }],
        });

        submissionAnswerRepositoryMock.bulkCreate.mockRejectedValue(new Error('Bulk insert error'));

        await expect(submissionService.createSubmission(inputData)).rejects.toThrow('Bulk insert error');
        expect(transactionMock.rollback).toHaveBeenCalled();
    });
});