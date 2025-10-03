const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors");

/**
 * Generic CRUD repository class to handle basic database operations for a given model
 */
class CrudRepository {
    constructor(model) {
        this.model = model;  // Sequelize model instance injected via constructor
    }

    /**
     * Create a new record with provided data
     * @param {Object} data - Fields for the new record
     * @returns {Object} Created record instance
     */
    async create(data) {
        const response = await this.model.create(data);
        return response;
    }

    /**
     * Delete a record by primary key ID
     * @param {number} id - ID of the record to delete
     * @returns {number} Number of rows deleted (0 or 1)
     */
    async destroy(id) {
        const response = await this.model.destroy({
            where: { id },
        });
        return response;
    }

    /**
     * Retrieve a record by primary key ID
     * Throws 404 error if not found
     * @param {number} id - ID of the record to retrieve
     * @returns {Object} Record instance
     */
    async get(id) {
        const response = await this.model.findByPk(id);
        if (!response) {
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    /**
     * Retrieve all records from the model's table
     * @returns {Array} List of records
     */
    async getAll() {
        const response = await this.model.findAll();
        return response;
    }

    /**
     * Update a record by primary key ID with provided data
     * @param {number} id - ID of the record to update
     * @param {Object} data - Updated field values
     * @returns {Array} Result of update operation [affectedCount, affectedRows]
     */
    async update(id, data) {
        const response = await this.model.update(data, {
            where: { id },
        });
        return response;
    }
}

module.exports = CrudRepository;
