'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SubmissionAnswer extends Model {
    static associate(models) {
      SubmissionAnswer.belongsTo(models.Submission, { foreignKey: 'submission_id', as: 'submission' });
      SubmissionAnswer.belongsTo(models.Question, { foreignKey: 'question_id', as: 'question' });
      SubmissionAnswer.belongsTo(models.Answer, { foreignKey: 'selected_answer_id', as: 'selectedAnswer' });
    }
  }

  SubmissionAnswer.init(
    {
      submissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'submission_id'
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'question_id'
      },
      selectedAnswerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'selected_answer_id'
      },
      textAnswer: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'text_answer'
      },
      score: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'SubmissionAnswer',
      tableName: 'submission_answers',
      timestamps: true,
      underscored: true
    }
  );

  return SubmissionAnswer;
};
