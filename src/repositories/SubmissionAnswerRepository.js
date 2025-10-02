const CrudRepository = require('./CrudRepository');
const { SubmissionAnswer } = require('../models');

class SubmissionAnswerRepository extends CrudRepository {
    constructor() {
        super(SubmissionAnswer);
    }

    // Bulk create submission answers within transaction
    async bulkCreate(answers, transaction) {
        return await this.model.bulkCreate(answers, { transaction });
    }
}

module.exports = SubmissionAnswerRepository;
