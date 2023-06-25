const PayRate = require("../controllers/admin/payRate");
const express = require('express')
const router = express.Router()
const {jwtApi} = require("../api")
router.use(jwtApi.validateToken)
router.get("/getpayrate", PayRate.getPayRate)
.put("/updatepayrate", PayRate.updatePayRate)
.delete("/deletepayrate/:id", PayRate.deletePayRateById)

    module.exports =  router;