
const jwt = require('jsonwebtoken');
const logger = require('./logger');
const secretKey = require('../config/env').actksecret;
function validateToken(req, res, next) {
    const dateTime = new Date(Date.now()).toLocaleString()
    logger.info("Request date time ", dateTime);
    const authHeader = req.headers['authorization']
    logger.info("Middleware header: " + authHeader);
    const token = authHeader && authHeader.split(' ')[1]
    logger.info("Token: ", token || "No token provided");
    if (token == null) return res.status(401).send('Invalid token')
    jwt.verify(token, secretKey, (er, user) => {
        if (er) return res.status(403).send('Token invalid or expired!')//res.sendStatus(403).send('invalid')
        logger.info(user);
        req.user = user;
        next()
    })
}
const generateToken = (user) => {
    logger.warn("=> generating token "+user);
    const token = jwt.sign({...user}, secretKey, { expiresIn: '24h' });
    return { token,user}
}
const getUserFromToken= (req, res) =>{
    const dateTime = new Date(Date.now()).toLocaleString()
    logger.info("Get user from Token: ",dateTime);
    const authHeader = req.headers['authorization']
    logger.info("Middleware header: "+authHeader);
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).send('Invalid token')
    jwt.verify(token, secretKey, (er, user) => {
        if (er) return res.status(403).send('Token invalid or expired!')//res.sendStatus(403).send('invalid')
        logger.info(user);
        res.status(200).send(user)
    })
}
const deleteToken = (req,res)=>{
    const dateTime = new Date(Date.now()).toLocaleString()
    logger.info("Signout: ",dateTime);
    const authHeader = req.headers['authorization']
    logger.info("Middleware header: "+authHeader);
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).send('Invalid token')
    const decodedToken = jwt.decode(token);
    decodedToken.exp = 0;
    res.status(200).send({status:'succeed'})
}

module.exports = {
    validateToken,
    generateToken,
    getUserFromToken,
    deleteToken
}