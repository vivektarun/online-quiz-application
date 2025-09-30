'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    static associate(models) {
      Answer.belongsTo(models.Question, { foreignKey: 'questionId', as: 'question' });
      Answer.hasMany(models.SubmissionAnswer, { foreignKey: 'selectedAnswerId', as: 'submissionAnswers', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
    }
  }

  Answer.init({
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    text: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: { msg: 'Answer text is required' },
        notEmpty: { msg: 'Answer text cannot be emtpy' }
      }
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Answer',
    tableName: 'Answers',
    timestamps: true
  });
  return Answer;
};