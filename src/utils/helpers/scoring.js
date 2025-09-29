function calculateMultipleChoiceScore(points, negativePoints, correctAnswers, selectedAnswers) {
    const correctSet = new Set(correctAnswers);
    const selectedSet = new Set(selectedAnswers);

    for(const ans of selectedSet) {
        if(!correctSet.has(ans)) return 0;
    }

    const numCorrectSelected = [...selectedSet].filter(c => correctSet.has(c)).length;
    const totalCorrect = correctSet.size;

    return points * (numCorrectSelected / totalCorrect);
}

module.exports = {
    calculateMultipleChoiceScore,
}