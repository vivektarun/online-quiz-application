const { CrudRepository } = require(".");
const { Quiz } = require('../models')

class QuizRepository extends CrudRepository {
    constructor() {
        super(Quiz);
    }
}

module.exports = QuizRepository;