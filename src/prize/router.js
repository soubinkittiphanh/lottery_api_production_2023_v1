
const controller = require("./controller")
const express = require("express")
const router = express.Router()
const {validateToken} = require('../api').jwtApi
router.use(validateToken)
router.post("/create",controller.createPrize)
.put("/update/:id",controller.updatePrize)
.delete("/find/:id",controller.deletePrize)
.get("/find",controller.getPrizes)
.get("/find/:id",controller.getPrizeById)
module.exports = router