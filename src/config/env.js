const config = {
  port: process.env.PORT || 8082,
  nodeEnv: process.env.NODE_ENV || "development",
  host: process.env.HOST || "localhost",
  actksecret:'lotterye3848b9bd2e3eee522325953aafc118ed017c811cc93fae99a4b2f5ba3506e0e217636b3b509055900cb1da7594b0ce6c7192907213291818a4fdc89bf605ce8',
  rfTkSecret:'lottere3848b9bd2e3eee522325953aafc118ed017c811cc93fae99a4b2f5ba3506e0e217636b3b509055900cb1da7',
  db: {
    // host: "mariadb-34248-0.cloudclusters.net",
    host: "150.95.31.23",
    user: "root",
    password: "sdat@3480",
    database: "lottery_pro_pakse",
    // database: "lottery_temp",
    // database: "lottery_temp_202306",
    port: 3306,
  },
};

module.exports = config;
