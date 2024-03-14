

const buildApp =require("./app.js");
const env=require("./config/env.js");
const logger = require("./api/logger.js");
const startApp=async()=>{
    const app = await buildApp();
    app.listen(env.port || 4000,()=>{
        logger.info("app is runing: "+env.port || 4000);
       logger.info("env: "+env.db.database);
    }).setTimeout(0)
}
startApp();