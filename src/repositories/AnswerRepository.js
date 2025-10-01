const CrudRepository = require('./CrudRepository');
const { Answer } = require('../models')

class AnswerRepository extends CrudRepository {
    constructor() {
        super(Answer);
    }
}

module.exports = AnswerRepository;