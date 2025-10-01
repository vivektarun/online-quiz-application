const CrudRepository = require('./CrudRepository');
const { Submission } = require('../models');

class SubmissionRepository extends CrudRepository {
  constructor() {
    super(Submission);
  }
}

module.exports = SubmissionRepository;
