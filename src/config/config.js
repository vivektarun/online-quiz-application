const { ServerConfig } = require("./");

module.exports = {
  development: {
    username: ServerConfig.DB_USERNAME,
    password: ServerConfig.DB_PASSWORD,
    database: ServerConfig.DB_DATABASE,
    host: ServerConfig.DB_HOST,
    dialect: ServerConfig.DB_DIALECT || 'mysql',
    logging: false // optional
  }
};
