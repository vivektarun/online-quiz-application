const { StatusCodes } = require('http-status-codes');
const { sequelize } = require('../models');
const { SubmissionRepository, SubmissionAnswerRepository, QuestionRepository, AnswerRepository } = require('../repositories');
const { AppError } = require('../utils/errors');


class SubmissionService {
    constructor() {
        this.submissionRepository = new SubmissionRepository();
        this.submissionAnswerRepository = new SubmissionAnswerRepository();
        this.questionRepository = new QuestionRepository();
        this.answerRepository = new AnswerRepository();
    }

    async createSubmission(data) {
        const transaction = await sequelize.transaction();

        try {
            //Fetch only questions answered by the user with associated answers
            console.log(data);
            const questionIds = data.answers.map(a => a.questionId);

            let quizQuestions = await this.questionRepository.model.findAll({
                where: {
                    quizId: data.quizId,
                    id: questionIds
                },
                include: [
                    {
                        model: this.answerRepository.model,
                        as: 'answers',
                        attributes: ['id', 'text', 'isCorrect'],
                    }
                ]
            });

            quizQuestions = quizQuestions.map(q => q.toJSON());
            console.log(quizQuestions);

            let totalScore = 0;
            let obtainedScore = 0;

            //Create submission record with zero score first
            const submission = await this.submissionRepository.create({
                quizId: data.quizId,
                score: 0,
                total: 0,
            }, { transaction });

            for(const userAnswer of data.answers) {
                const question = quizQuestions.find(q => q.id === userAnswer.questionId);
                console.log(question);

                if(!question) {
                    throw new AppError(`Question ${userAnswer.questionId} not found for quiz`, StatusCodes.BAD_REQUEST);
                }
                totalScore += parseFloat(question.points);
                let score = 0;

                if(question.type === 'text') {
                    //case-insensitive exact match checking
                    const correctTexts = question.answers.filter(a => a.isCorrect).map(a => a.text.toLowerCase().trim());

                    if(userAnswer.textAnswer && correctTexts.includes(userAnswer.textAnswer.toLowerCase().trim())) {
                        score = parseFloat(question.points);
                    } else {
                        score = -parseFloat(question.negativePoints);
                    }

                    await this.submissionAnswerRepository.create({
                        submissionId: submission.id,
                        questionId: userAnswer.questionId,
                        selectedAnswerId: null,
                        textAnswer: userAnswer.textAnswer || null,
                        score: score
                    }, { transaction })

                } else if(question.type === 'single_choice') {
                    console.log(question.type);
                    const correctAnswerId = question.answers.find(a => a.isCorrect)?.id;
                    console.log(correctAnswerId);

                    if(userAnswer.selectedAnswerId === correctAnswerId) {
                        score = parseFloat(question.points);
                    } else {
                        score = -parseFloat(question.negativePoints);
                    }

                    await this.submissionAnswerRepository.create({
                        submissionId: submission.id,
                        questionId: userAnswer.questionId,
                        selectedAnswerId: userAnswer.selectedAnswerId || null,
                        textAnswer: null,
                        score: score
                    }, { transaction });

                } else if(question.type === 'multiple_choice') {
                    // Collect correct answer Ids
                    const correctIds = question.answers.filter(a => a.isCorrect).map(a => a.id);
                    const negativePoints = parseFloat(question.negativePoints);
                    const pointsPerCorrect = parseFloat(question.points)/ correctIds.length;

                    //user submitted answers should be array; validate that
                    const selectedIds = Array.isArray(userAnswer.selectedAnswerId) ? userAnswer.selectedAnswerId : [userAnswer.selectedAnswerId];
                    
                    const hasWrongSelected = selectedIds.some(id => !correctIds.includes(id));

                    let questionTotalScore;

                    if(hasWrongSelected) {
                        //Apply negative marks once for the entire question
                        questionTotalScore = -negativePoints;
                    } else {
                        //sum points for correctly selected answers only
                        const numCorrectSelected = selectedIds.length;
                        questionTotalScore = pointsPerCorrect * numCorrectSelected;
                    }

                    //Insert submissionAnswer recored for each selected answer
                    for(let i = 0; i < selectedIds.length; i++) {
                        await this.submissionAnswerRepository.create({
                            submissionId: submission.id,
                            questionId: userAnswer.questionId,
                            selectedAnswerId: selectedIds[i],
                            textAnswer: null,
                            //Store full question score only on first selcted answer
                            socre: i === 0 ? questionTotalScore : 0,
                        }, { transaction });
                    }

                    score = questionTotalScore;
                }

                obtainedScore += score;
            }

            submission.score = obtainedScore;
            submission.total = totalScore;
            await submission.save({ transaction });

            await transaction.commit();

            return {
                quizId: submission.quizId,
                totalScore: submission.total,
                ScoreObtained: submission.score
            }
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
}

module.exports = SubmissionService;