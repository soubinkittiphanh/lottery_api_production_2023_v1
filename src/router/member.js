const controller = require("../controllers/admin/member");
const express = require('express')
const router = express.Router()
const {jwtApi} = require("../api")
router.use(jwtApi.validateToken)
router
    .post("/createuser", controller.createMember)
router
    .put("/updateuser", controller.updateMember)
router
    .put("/resetpass", controller.resetPassword)
router
    .get("/gen_uid", controller.genId)
router
    .get("/fetchuser", controller.getMember)
router
    .get("/fetchuserid", controller.getMemberById)
router
.get("/winreport_group",controller.winSaleReport)
router
.get("/member_sale_report",controller.memberSaleReport)

    module.exports = router;
