const { Sequelize, DataTypes } = require('sequelize')
const logger = require('./logger')
const env = require('../config/env').db
const sequelize = new Sequelize(
    env.database,
    env.user,
    env.password,
    {
        host: env.host,
        dialect: 'mariadb',
        port: env.port,
        pool: {
            max: 10,
            min: 10,
            acquire: 30000,
            idle: 10000
        }
    }
)
// DataTypes.NUMBER
sequelize.authenticate().then(() => {
    logger.info("DB Connection established")
}).catch(err => {
    logger.error("DB Connection error: " + err);
})

module.exports = sequelize