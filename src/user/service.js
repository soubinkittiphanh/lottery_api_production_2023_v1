const logger = require("../api/logger");

const User = require("../model").user; // Import the users model
// Get a specific user by ID
module.exports = {
    async getById(id, pw) {
        logger.info("userId => " + id)
        try {
            const dbUser = await User.findByPk(id, {
                where: {
                    signonId: id,
                    password: pw
                }, include: 'branch'
            });
            if (!dbUser) {
                return null;
            }
            return dbUser;
        } catch (err) {
            return null
        }
    }
}