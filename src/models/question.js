'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      Question.belongsTo(models.Quiz, { foreignKey: 'quizId', as: 'quiz' })
    }
  }
  Question.init({
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: false
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
      type: DataTypes.ENUM('single_choice', 'multiple_choice', 'text'),
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
      validate : { min: 0 }
    }
  }, {
    sequelize,
    modelName: 'Question',
    tableName: 'Questions',
    timestamps: true
  });

  return Question;
};