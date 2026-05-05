/* global process */
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Crypto from "../models/Crypto.js";
import seedCryptoData from "../data/seedCryptoData.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    await Crypto.deleteMany({});
    await Crypto.insertMany(seedCryptoData);
    console.log("Crypto data seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
