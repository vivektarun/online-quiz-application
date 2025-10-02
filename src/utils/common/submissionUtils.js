/**
 * Scores a text question.
 * Returns object with score and submissionAnswer record data.
 */
function scoreTextQuestion(question, userAnswer, submissionId) {
    const correctTexts = question.answers
        .filter(a => a.isCorrect)
        .map(a => a.text.toLowerCase().trim());

    const isCorrect = userAnswer.textAnswer && correctTexts.includes(userAnswer.textAnswer.toLowerCase().trim());
    const score = isCorrect ? parseFloat(question.points) : -parseFloat(question.negativePoints);

    return {
        score,
        submissionAnswers: [{
            submissionId,
            questionId: question.id,
            selectedAnswerId: null,
            textAnswer: userAnswer.textAnswer || null,
            score,
        }],
    };
}

/**
 * Scores a single choice question.
 */
function scoreSingleChoiceQuestion(question, userAnswer, submissionId) {
    const correctAnswerId = question.answers.find(a => a.isCorrect)?.id;
    const isCorrect = userAnswer.selectedAnswerId === correctAnswerId;
    const score = isCorrect ? parseFloat(question.points) : -parseFloat(question.negativePoints);

    return {
        score,
        submissionAnswers: [{
            submissionId,
            questionId: question.id,
            selectedAnswerId: userAnswer.selectedAnswerId || null,
            textAnswer: null,
            score,
        }],
    };
}

/**
 * Scores a multiple choice question.
 * Returns score and one or more submissionAnswer records.
 */
function scoreMultipleChoiceQuestion(question, userAnswer, submissionId) {
    const correctIds = question.answers.filter(a => a.isCorrect).map(a => a.id);
    const negativePoints = parseFloat(question.negativePoints);
    const pointsPerCorrect = parseFloat(question.points) / correctIds.length;

    const selectedIds = Array.isArray(userAnswer.selectedAnswerId)
        ? userAnswer.selectedAnswerId
        : [userAnswer.selectedAnswerId];

    const hasWrongSelected = selectedIds.some(id => !correctIds.includes(id));

    let questionTotalScore = 0;
    if (hasWrongSelected) {
        questionTotalScore = -negativePoints;
    } else {
        questionTotalScore = pointsPerCorrect * selectedIds.length;
    }

    // First selected answer gets full score, others 0
    const submissionAnswers = selectedIds.map((id, idx) => ({
        submissionId,
        questionId: question.id,
        selectedAnswerId: id,
        textAnswer: null,
        score: idx === 0 ? questionTotalScore : 0,
    }));

    return {
        score: questionTotalScore,
        submissionAnswers,
    };
}

module.exports = {
    scoreTextQuestion,
    scoreSingleChoiceQuestion,
    scoreMultipleChoiceQuestion,
};
