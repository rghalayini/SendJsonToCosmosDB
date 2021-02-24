// @ts-check
require('dotenv').config()

const config = {
    endpoint: process.env.ENDPOINT,
    key: process.env.KEY,
    databaseId: "Tasks",
    containerId: "Items",
    partitionKey: { kind: "Hash", paths: ["/category"] }
  };
  
  module.exports = config;