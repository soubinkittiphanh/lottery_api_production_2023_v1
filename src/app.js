
const express = require("express");
const cors = require("cors");
const router = require("./router")
const authenticate = require("./authentication");
const { jwtApi } = require("./api");
const buildApp = async () => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.get("/", (req, res) => {
        res.send("Server is up")
    })
    //*********************** Security *************************
    app.post("/api/signon",authenticate);
    app.get("/api/logout",jwtApi.deleteToken);
    app.get("/api/me",jwtApi.getUserFromToken);
    //*********************** Security *************************
    
    app.use("/api/category",router.category)
    app.use("/api/branch",router.branch)
    app.use("/api/user",router.user)
    app.use("/api/max",router.maxSale)
    app.use("/api/schedule",router.schedule)
    app.use("/api/prize",router.prize)
    app.use("/api/transaction",router.transaction)

    return app;
}

module.exports = buildApp;