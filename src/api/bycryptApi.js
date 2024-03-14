const bcrypt = require('bcrypt');
const logger = require('./logger');
const saltRounds = 10;
// Hash the password
const hashPassword = (password) => {
    const encryptPassword = bcrypt.hashSync(password, saltRounds)
    return encryptPassword;
}
const matchPassword = async (plainePassword, hashPassword) => {
    const isMatch = bcrypt.compareSync(plainePassword, hashPassword)
    logger.warn("password match result "+isMatch)
    return isMatch;
}

module.exports = {
    hashPassword,
    matchPassword,
}
