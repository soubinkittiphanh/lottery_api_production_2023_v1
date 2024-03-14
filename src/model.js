const { Sequelize, DataTypes } = require('sequelize')
const logger = require('./api/logger')
const sequelize = require('./config')
// const env = require('./config/env').db
// const sequelize = new Sequelize(
//     env.database,
//     env.user,
//     env.password,
//     {
//         host: env.host,
//         dialect: 'mariadb',
//         port: env.port,
//         pool: {
//             max: 10,
//             min: 10,
//             acquire: 30000,
//             idle: 10000
//         }
//     }
// )
DataTypes.NUMBER
sequelize.authenticate().then(() => {
    logger.info("DB Connection established")
}).catch(err => {
    logger.error("DB Connection error: " + err);
})
const db = {}
db.sequelize = sequelize;
db.Sequelize = Sequelize
db.category = require("./category/model")(sequelize, DataTypes);
db.branch = require("./branch/model")(sequelize, DataTypes);
db.user = require("./user/model")(sequelize, DataTypes);
db.schedule = require("./saleSchedule/model")(sequelize, DataTypes);
db.maxSale = require("./maxSale/model")(sequelize, DataTypes);
db.transaction = require("./transaction/model")(sequelize, DataTypes);
db.prize = require("./prize/model")(sequelize, DataTypes);
// db.sequelize.drop(); //Drop all table in database
db.sequelize.sync({ force: false, alter: true }).then(() => {
    logger.info("Datatase is synchronize")
})

db.branch.hasMany(db.user, {
    as: 'users',
})
db.user.belongsTo(db.branch, {
    foreignKey: 'branchId', // Key store in user table
    as: 'branch',// No idea what it means
})

db.category.hasMany(db.schedule, {
    as: 'schedules'
})
db.schedule.belongsTo(db.category, {
    foreignKey: 'categoryId',
    as: 'category'
})

db.branch.hasOne(db.maxSale)
db.maxSale.belongsTo(db.branch)

db.user.hasMany(db.transaction, {
    // foreignKey:'',
    as: 'transactions'
})
db.transaction.belongsTo(db.user, {
    foreignKey: "userId",
    as: 'user'
})

db.category.hasMany(db.transaction, {
    as: 'transactions'
})
db.transaction.belongsTo(db.category, {
    foreignKey: "categoryId",
    as: 'category'
})
db.transaction.belongsTo(db.branch, {
    foreignKey: "branchId",
    as: 'branch'
})
db.schedule.hasMany(db.transaction,{
    as: 'transactions'
})
db.transaction.belongsTo(db.schedule,{
    foreignKey: 'scheduleId',
    as: 'schedule'
})
db.branch.hasOne(db.prize, {
    as: 'prize'
}
)
db.prize.belongsTo(db.branch, {
    foreignKey: "branchId",
    as: 'branch',
    unique: true 
})

module.exports = db