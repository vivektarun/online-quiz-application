'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {
    static associate(models) {
      // Each Submission belongs to a Quiz
      Submission.belongsTo(models.Quiz, { foreignKey: 'quizId', as: 'quiz' });
    }
  }
  Submission.init({
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    score: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
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
    tableName: 'Submissions',
    timestamps: true
  });
  return Submission;
};