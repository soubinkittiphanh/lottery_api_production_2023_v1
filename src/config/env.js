const config={
    port:process.env.PORT||8081,
    nodeEnv:process.env.NODE_ENV||"development",
    host:process.env.HOST||"localhost",
    actksecret:'e3848b9bd2e3eee522325953aafc118ed017c811cc93fae99a4b2f5ba3506e0e217636b3b509055900cb1da7594b0ce6c7192907213291818a4fdc89bf605ce8',
    rfTkSecret:'e3848b9bd2e3eee522325953aafc118ed017c811cc93fae99a4b2f5ba3506e0e217636b3b509055900cb1da7',
    db:{
        host:'150.95.31.23',
        user:'root',
        password:'sdat@3480',
        // database:'peeair_demo',
        // database:'dcommerce_uat',
        database:'lottery_r23_dev',
        port: 3306,
    }
}
module.exports=config;