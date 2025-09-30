'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SubmissionAnswer extends Model {
    static associate(models) {
      SubmissionAnswer.belongsTo(models.Submission, { foreignKey: 'submissionId', as: 'submission' });
      SubmissionAnswer.belongsTo(models.Question, { foreignKey: 'questionId', as: 'question' });
      SubmissionAnswer.belongsTo(models.Answer, { foreignKey: 'selectedAnswerId', as: 'selectedAnswer' });
    }
  }

  SubmissionAnswer.init(
    {
      submissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      selectedAnswerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      textAnswer: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      score: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
    },
    {
      sequelize,
      modelName: 'SubmissionAnswer',
      tableName: 'SubmissionAnswers',
      timestamps: true,
    }
  );

  return SubmissionAnswer;
};
