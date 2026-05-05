import express from "express";
import {
  getAllCrypto,
  getTopGainers,
  getNewListings,
  createCrypto,
} from "../controllers/cryptoController.js";

const router = express.Router();

router.get("/", getAllCrypto);
router.get("/gainers", getTopGainers);
router.get("/new", getNewListings);
router.post("/", createCrypto);

export default router;
