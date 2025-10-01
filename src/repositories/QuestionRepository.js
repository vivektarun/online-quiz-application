const CrudRepository = require("./CrudRepository");
const { Question } = require('../models');

class QuestionRepository extends CrudRepository {
    constructor() {
        super(Question);
    }
}

module.exports = QuestionRepository;