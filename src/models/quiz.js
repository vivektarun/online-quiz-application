'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    static associate(models) {
      Quiz.hasMany(models.Question, { foreignKey: 'quiz_id', as: 'questions', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
      Quiz.hasMany(models.Submission, { foreignKey: 'quiz_id', as: 'submissions', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
  }
  Quiz.init({
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: { msg: 'Quiz title is required' },
        notEmpty: { msg: 'Quiz title cannot be empty' }
      }
    }
  }, {
    sequelize,
    modelName: 'Quiz',
    tableName: 'quizzes',
    timestamps: true,
    underscored: true
  });
  return Quiz;
};