const CrudRepository = require('./CrudRepository');
const { SubmissionAnswer } = require('../models');

/**
 * Repository class for submission answer-related database operations
 * Extends generic CRUD repository and adds bulk create functionality within a transaction
 */
class SubmissionAnswerRepository extends CrudRepository {
    constructor() {
        super(SubmissionAnswer);  // Initialize with the SubmissionAnswer model
    }

    /**
     * Bulk insert multiple submission answer records using a transaction
     * @param {Array} answers - Array of submission answer objects to insert
     * @param {Object} transaction - Sequelize transaction instance for atomic operation
     * @returns {Promise<Array>} Inserted submission answer records
     */
    async bulkCreate(answers, transaction) {
        return await this.model.bulkCreate(answers, { transaction });
    }
}

module.exports = SubmissionAnswerRepository;
