const dotenv = require('dotenv');

// Load environment variables from .env file into process.env
dotenv.config();

module.exports = {
    // Server port number, read from environment variables
    PORT: process.env.PORT,

    // Current Node environment mode (e.g., development, production)
    NODE_ENV: process.env.NODE_ENV,
};
