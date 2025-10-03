/**
 * Scores a text question.
 * Compares user's text answer to correct answers (case-insensitive, trimmed).
 * Returns an object containing total score and a submission answer record.
 * @param {Object} question - Question object including correct answers and points
 * @param {Object} userAnswer - User's submitted answer with textAnswer property
 * @param {number} submissionId - ID of the parent submission
 * @returns {Object} Object with score and array of submissionAnswer records
 */
function scoreTextQuestion(question, userAnswer, submissionId) {
    // Extract correct answers' texts (lowercase and trimmed for comparison)
    const correctTexts = question.answers
        .filter(a => a.isCorrect)
        .map(a => a.text.toLowerCase().trim());

    // Check if user's textAnswer matches any correct answer
    const isCorrect = userAnswer.textAnswer && correctTexts.includes(userAnswer.textAnswer.toLowerCase().trim());

    // Assign positive points if correct, else negative points
    const score = isCorrect ? parseFloat(question.points) : -parseFloat(question.negativePoints);

    return {
        score,
        submissionAnswers: [{
            submissionId,
            questionId: question.id,
            selectedAnswerId: null, // No selectedAnswerId for text questions
            textAnswer: userAnswer.textAnswer || null,
            score,
        }],
    };
}

/**
 * Scores a single choice question.
 * Checks if user selected the correct answer ID.
 * Returns score and one submission answer record.
 * @param {Object} question - Question object with answers
 * @param {Object} userAnswer - User answer with selectedAnswerId
 * @param {number} submissionId - ID of submission
 * @returns {Object} Score and submissionAnswer record
 */
function scoreSingleChoiceQuestion(question, userAnswer, submissionId) {
    // Find ID of the correct answer
    const correctAnswerId = question.answers.find(a => a.isCorrect)?.id;

    // Compare user's selectedAnswerId with correct answer ID
    const isCorrect = userAnswer.selectedAnswerId === correctAnswerId;

    // Assign positive or negative points accordingly
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
 * User's selected answers can be single value or array.
 * Penalizes if any incorrect answer selected, otherwise assigns partial credit for correct selections.
 * First selected answer record gets full score, others zero.
 * @param {Object} question - Question with answers data
 * @param {Object} userAnswer - User answer containing selectedAnswerId(s)
 * @param {number} submissionId - Submission ID
 * @returns {Object} Total score and array of submissionAnswer records
 */
function scoreMultipleChoiceQuestion(question, userAnswer, submissionId) {
    // Get correct answer IDs for the question
    const correctIds = question.answers.filter(a => a.isCorrect).map(a => a.id);
    const negativePoints = parseFloat(question.negativePoints);
    const pointsPerCorrect = parseFloat(question.points) / correctIds.length;

    // Normalize selectedAnswerId to an array
    const selectedIds = Array.isArray(userAnswer.selectedAnswerId)
        ? userAnswer.selectedAnswerId
        : [userAnswer.selectedAnswerId];

    // Check if any selected ID is incorrect (not in correctIds)
    const hasWrongSelected = selectedIds.some(id => !correctIds.includes(id));

    // Calculate question total score based on correctness
    let questionTotalScore = 0;
    if (hasWrongSelected) {
        questionTotalScore = -negativePoints; // Penalize for wrong selection
    } else {
        questionTotalScore = pointsPerCorrect * selectedIds.length; // Partial credit for each correct selected
    }

    // Prepare submission answer records: first selected gets full score, rest get 0
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
