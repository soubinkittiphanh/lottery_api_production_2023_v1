
const User = require("../model").user; // Import the users model
const Branch = require("../model").branch
const bcrypt = require("../api/bycryptApi");
const logger = require("../api/logger");
const usersController = {
    // Get all users
    async getAll(req, res) {
        try {
            const allUsers = await User.findAll({ include: 'branch' });
            res.status(200).json(allUsers);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Get a specific user by ID
    async getById(req, res) {
        const { id } = req.params;
        logger.info("ID => " + id)
        try {
            const dbUser = await User.findByPk(id, { include: 'branch' });
            if (!dbUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(dbUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Create a new user
    async create(req, res) {
        let { signonId, password, name, tel, accountType, isActive, branchId, salePercentage, winPercentage } = req.body;
        // ************ Check if branch id is exist ************ //
        try {
            const dbBranch = await Branch.findByPk(branchId);
            if (!dbBranch) {
                return res.status(404).json({ message: 'Branch code ' + branchId + ' is invalid' });
            }
        } catch (error) {
            return res.status(404).json({ message: 'Branch code ' + branchId + ' is invalid ' + error });
        }
        // ************ Check if branch id is exist ************ //
        //  *********** has password **********
        const passwordHash = bcrypt.hashPassword(password)
        logger.info("password has : " + passwordHash);
        // return res.send(passwordHash)
        if (password == passwordHash) return res.send("Server error try again later")
        password = passwordHash;
        try {
            const newUser = await User.create({
                signonId,
                password,
                name,
                tel,
                accountType,
                isActive,
                branchId, salePercentage, winPercentage
            });
            res.status(200).json(newUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Update an existing user by ID
    async update(req, res) {
        logger.info("Update user ")
        const { id } = req.params;
        const {  name, tel, accountType, isActive, salePercentage, winPercentage, branchId } = req.body;
        try {
            const dbUser = await User.findByPk(id)
            logger.warn("User => " + dbUser.name)
            if (dbUser) {
                await dbUser.update({
                    name,
                    tel,
                    accountType,
                    isActive,
                    salePercentage,
                    winPercentage,
                    branchId
                })
                res.status(200).json(dbUser);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (err) {
            logger.error("Server error " + err)
            res.status(500).json(err);
        }
    },

    // Delete a user by ID
    async delete(req, res) {
        const { id } = req.params;
        try {
            const deletedUser = await User.destroy({ where: { id } });
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

module.exports = usersController;
