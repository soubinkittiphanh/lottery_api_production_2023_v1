
const controller = require("./controller")
const express = require("express")
const router = express.Router()
const { validateToken } = require('../api').jwtApi
// router.use(validateToken)
// No auth 
// router.use((req,res,next)=>{
//     next()
// })
router.post("/create", controller.create)
    .put("/update/:id", controller.update)
    .delete("/find/:id", controller.delete)
    .get("/find", controller.getAll)
    .get("/find/:id", controller.getById)
module.exports = router