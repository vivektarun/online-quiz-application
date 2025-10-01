const CrudRepository = require('./CrudRepository');
const { SubmissionAnswer } = require('../models');

class SubmissionAnswerRepository extends CrudRepository {
  constructor() {
    super(SubmissionAnswer);
  }
}

module.exports = SubmissionAnswerRepository;
