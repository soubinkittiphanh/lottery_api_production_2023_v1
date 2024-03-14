
const controller = require("./controller")
const express = require("express")
const router = express.Router()
const { validateToken } = require('../api').jwtApi
router.use(validateToken)
// No auth 
// router.use((req,res,next)=>{
//     next()
// })
router.post("/create", controller.createSchedule)
.get("/findLast5",controller.getAllLast5Schedules)
    .put("/update/:id", controller.updateScheduleById)
    .delete("/find/:id", controller.deleteScheduleById)
    .get("/find", controller.getAllActiveSchedules)
    .get("/findAll", controller.getAllSchedules)
    .get("/find/:id", controller.getScheduleById)
module.exports = router