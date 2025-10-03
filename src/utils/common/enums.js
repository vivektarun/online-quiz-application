/**
 * Enumeration for different types of questions supported in the quiz system.
 * Using constants helps avoid magic strings and typos elsewhere in the code.
 */
const QUESTION_TYPE = {
    SINGLE_CHOICE : 'single_choice',    // Question with only one correct answer
    MULTIPLE_CHOICE : 'multiple_choice',// Question with multiple correct answers possible
    TEXT : 'text'                       // Question expecting a text-based answer
};

module.exports = {
    QUESTION_TYPE
};
