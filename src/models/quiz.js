'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
    tableName: 'Quizzes',
    timestamps: true,
  });
  return Quiz;
};