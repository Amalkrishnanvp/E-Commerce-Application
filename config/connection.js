const { MongoClient } = require("mongodb");
require("dotenv").config();
const essentials = require("./essentials");

// Connection string
const uri = process.env.MONGO_URI;
const dbName = essentials.DATABASE;

let db;

const connectToDb = async () => {
  try {
    // Creating client object
    const client = new MongoClient(uri);
    // Connect to database
    await client.connect();
    console.log("Connected to MongoDB");

    // Access database
    db = client.db(dbName);
    console.log("Connected to database");
  } catch (error) {
    console.log("Error connecting to datbase:", error);
  }
};

const getDb = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectToDb first.");
  }
  return db;
};

module.exports = { connectToDb, getDb };
