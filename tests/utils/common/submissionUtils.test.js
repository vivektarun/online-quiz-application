const {
  scoreTextQuestion,
  scoreSingleChoiceQuestion,
  scoreMultipleChoiceQuestion,
} = require('../../../src/utils/common/submissionUtils');

describe('Scoring utilities', () => {
  describe('scoreTextQuestion', () => {
    const question = {
      id: 1,
      points: '5',
      negativePoints: '2',
      answers: [
        { text: 'Answer One', isCorrect: true },
        { text: 'Answer Two', isCorrect: true },
        { text: 'Wrong Answer', isCorrect: false }
      ]
    };
    const submissionId = 100;

    it('should award full points for exact case-insensitive match', () => {
      const userAnswer = { textAnswer: 'answer one' };
      const result = scoreTextQuestion(question, userAnswer, submissionId);

      expect(result.score).toBe(5);
      expect(result.submissionAnswers).toEqual([{
        submissionId,
        questionId: 1,
        selectedAnswerId: null,
        textAnswer: 'answer one',
        score: 5,
      }]);
    });

    it('should award full points for trimmed answer', () => {
      const userAnswer = { textAnswer: '  Answer Two  ' };
      const result = scoreTextQuestion(question, userAnswer, submissionId);

      expect(result.score).toBe(5);
      expect(result.submissionAnswers[0].textAnswer).toBe('  Answer Two  ');
    });

    it('should apply negative points for incorrect answer', () => {
      const userAnswer = { textAnswer: 'wrong' };
      const result = scoreTextQuestion(question, userAnswer, submissionId);

      expect(result.score).toBe(-2);
    });

    it('should apply negative points if answer is empty or undefined', () => {
      let res = scoreTextQuestion(question, { textAnswer: '' }, submissionId);
      expect(res.score).toBe(-2);

      res = scoreTextQuestion(question, {}, submissionId);
      expect(res.score).toBe(-2);
    });
  });

  describe('scoreSingleChoiceQuestion', () => {
    const question = {
      id: 2,
      points: '3',
      negativePoints: '1',
      answers: [
        { id: 10, isCorrect: false },
        { id: 20, isCorrect: true },
      ]
    };
    const submissionId = 200;

    it('should award points if selected answer ID is correct', () => {
      const userAnswer = { selectedAnswerId: 20 };
      const result = scoreSingleChoiceQuestion(question, userAnswer, submissionId);

      expect(result.score).toBe(3);
      expect(result.submissionAnswers[0]).toMatchObject({
        submissionId,
        questionId: 2,
        selectedAnswerId: 20,
        textAnswer: null,
        score: 3,
      });
    });

    it('should apply negative points if selected answer ID is incorrect', () => {
      const userAnswer = { selectedAnswerId: 10 };
      const result = scoreSingleChoiceQuestion(question, userAnswer, submissionId);

      expect(result.score).toBe(-1);
    });

    it('should apply negative points if no answer selected (null)', () => {
      const userAnswer = { selectedAnswerId: null };
      const result = scoreSingleChoiceQuestion(question, userAnswer, submissionId);

      expect(result.score).toBe(-1);
    });
  });

  describe('scoreMultipleChoiceQuestion', () => {
    const question = {
      id: 3,
      points: '6',
      negativePoints: '2',
      answers: [
        { id: 101, isCorrect: true },
        { id: 102, isCorrect: true },
        { id: 103, isCorrect: false }
      ]
    };
    const submissionId = 300;

    it('should award full points proportional to correctly selected answers', () => {
      const userAnswer = { selectedAnswerId: [101] };
      const result = scoreMultipleChoiceQuestion(question, userAnswer, submissionId);

      expect(result.score).toBe(3); // 6 points / 2 correct answers * 1 selected
      expect(result.submissionAnswers.length).toBe(1);
      expect(result.submissionAnswers[0].score).toBe(3);
    });

    it('should award full score for multiple correct selections', () => {
      const userAnswer = { selectedAnswerId: [101, 102] };
      const result = scoreMultipleChoiceQuestion(question, userAnswer, submissionId);

      expect(result.score).toBe(6);
      expect(result.submissionAnswers.length).toBe(2);
      expect(result.submissionAnswers[0].score).toBe(6);
      expect(result.submissionAnswers[1].score).toBe(0);
    });

    it('should apply negative points for any selected wrong answer', () => {
      const userAnswer = { selectedAnswerId: [101, 103] };
      const result = scoreMultipleChoiceQuestion(question, userAnswer, submissionId);

      expect(result.score).toBe(-2);
    });

    it('should normalize single selectedAnswerId and treat it as array', () => {
      const userAnswer = { selectedAnswerId: 102 };
      const result = scoreMultipleChoiceQuestion(question, userAnswer, submissionId);

      expect(result.score).toBe(3);
      expect(result.submissionAnswers.length).toBe(1);
      expect(result.submissionAnswers[0].selectedAnswerId).toBe(102);
      expect(result.submissionAnswers[0].score).toBe(3);
    });

    it('should handle empty selectedAnswerId array and return 0 score and empty submissionAnswers', () => {
      const userAnswer = { selectedAnswerId: [] };
      const result = scoreMultipleChoiceQuestion(question, userAnswer, submissionId);

      expect(result.score).toBe(0);
      expect(result.submissionAnswers.length).toBe(0);
    });
  });
});
