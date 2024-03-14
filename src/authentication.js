const logger = require("./api/logger");
const bcrypt = require("./api/bycryptApi")
const User = require("./model").user
const jwtApi = require("./api/jwtApi")
const authenticateUser = async (req, res) => {
    logger.warn("(**** Authenticate user ****)")
    const { signonId, password } = req.body
    User.findOne({ where: { signonId,isActive:true }}).then(async(user) => {
        logger.warn("USER DB "+user.name)
        const matchPassword = await bcrypt.matchPassword(password, user.password);
        if(!matchPassword)return res.status(401).send("Password is incorrect")
        // user.branch=user.branch.branchCode
        const payload =  jwtApi.generateToken(user)
        return res.status(200).send(payload)
    }).catch(error => {
        return res.status(401).send("User is not valid " + error)
    });
}
module.exports = authenticateUser