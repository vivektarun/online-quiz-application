'use strict';
const { Model } = require('sequelize');

const { Enums } = require('../utils/common');
const { SINGLE_CHOICE, MULTIPLE_CHOICE, TEXT } = Enums.QUESTION_TYPE;

module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      Question.belongsTo(models.Quiz, { foreignKey: 'quiz_id', as: 'quiz' });
      Question.hasMany(models.Answer, { foreignKey: 'question_id', as: 'answers', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
      Question.hasMany(models.SubmissionAnswer, { foreignKey: 'question_id', as: 'submissionAnswers', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
    }
  }
  Question.init({
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'quiz_id'
    },
    text: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: { msg: 'Question text is required' },
        notEmpty: { msg: 'Question text cannot be empty' }
      }
    },
    type: {
      type: DataTypes.ENUM(SINGLE_CHOICE, MULTIPLE_CHOICE, TEXT),
      allowNull: false
    },
    points: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: false,
      validate: { min: 0 }
    },
    negativePoints: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: false,
      defaultValue: 0,
      validate : { min: 0 },
      field: 'negative_points'
    }
  }, {
    sequelize,
    modelName: 'Question',
    tableName: 'questions',
    timestamps: true,
    underscored: true
  });

  return Question;
};