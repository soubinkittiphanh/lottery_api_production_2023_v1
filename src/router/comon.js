const Init = require("../controllers/init");
const {jwtApi} = require("../api")
const express = require('express');
const logger = require("../api/logger");
const router = express.Router()
router.use((req, res, next) => {
    logger.info("User authentication")
    next()
})

router.get("/", Init.home)
router.get("/dbuser", Init.dbuser)
router.post("/auth", jwtApi.signOn)
router.post("/auth_web", Init.auth)


module.exports =  router;