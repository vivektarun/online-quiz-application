'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {
    static associate(models) {
      // Each Submission belongs to a Quiz
      Submission.belongsTo(models.Quiz, { foreignKey: 'quiz_id', as: 'quiz' });
      Submission.hasMany(models.SubmissionAnswer, { foreignKey: 'submission_id', as: 'submissionAnswers', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
  }
  Submission.init({
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'quiz_id'
    },
    score: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      validate: {
        min: 0
      }
    }
  }, {
    sequelize,
    modelName: 'Submission',
    tableName: 'submissions',
    timestamps: true,
    underscored: true
  });
  return Submission;
};