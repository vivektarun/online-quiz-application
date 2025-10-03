'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    static associate(models) {
      Answer.belongsTo(models.Question, { foreignKey: 'question_id', as: 'question' });
      Answer.hasMany(models.SubmissionAnswer, { foreignKey: 'selected_answre_id', as: 'submissionAnswers', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
    }
  }

  Answer.init({
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'question_id'
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
      defaultValue: false,
      field: 'is_correct'
    }
  }, {
    sequelize,
    modelName: 'Answer',
    tableName: 'answers',
    timestamps: true,
    underscored: true
  });
  return Answer;
};