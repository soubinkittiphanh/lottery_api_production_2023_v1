
const controller = require("./controller")
const express = require("express")
const router = express.Router()
const {validateToken} = require('../api').jwtApi
router.use(validateToken)
router.post("/create",controller.createCategory)
.put("/update/:id",controller.updateCategoryById)
.delete("/find/:id",controller.deleteCategoryById)
.get("/find",controller.getAllCategories)
.get("/find/:id",controller.getCategoryById)
module.exports = router