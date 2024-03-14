const category = require("./category").router
const user = require("./user").router
const branch = require("./branch").router
const maxSale = require("./maxSale").router
const schedule = require("./saleSchedule").router
const prize = require("./prize").router
const transaction = require("./transaction").router

module.exports = {
    category,
    user,
    branch,
    maxSale,
    schedule,
    prize,
    transaction
}