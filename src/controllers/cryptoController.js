import Crypto from "../models/Crypto.js";

const getAllCrypto = async (req, res) => {
  try {
    const cryptos = await Crypto.find().sort({ createdAt: -1 });
    return res.status(200).json({ data: cryptos });
  } catch {
    return res.status(500).json({ message: "Failed to fetch cryptocurrencies." });
  }
};

const getTopGainers = async (req, res) => {
  try {
    const cryptos = await Crypto.find().sort({ change24h: -1 }).limit(10);
    return res.status(200).json({ data: cryptos });
  } catch {
    return res.status(500).json({ message: "Failed to fetch top gainers." });
  }
};

const getNewListings = async (req, res) => {
  try {
    const cryptos = await Crypto.find().sort({ createdAt: -1 }).limit(10);
    return res.status(200).json({ data: cryptos });
  } catch {
    return res.status(500).json({ message: "Failed to fetch new listings." });
  }
};

const createCrypto = async (req, res) => {
  try {
    const { name, symbol, price, image, change24h } = req.body;

    if (!name || !symbol || price === undefined || change24h === undefined) {
      return res.status(400).json({
        message: "Name, symbol, price, and 24h change are required.",
      });
    }

    const crypto = await Crypto.create({
      name,
      symbol,
      price: Number(price),
      image: image || "",
      change24h: Number(change24h),
    });

    return res.status(201).json({
      message: "Cryptocurrency created successfully.",
      data: crypto,
    });
  } catch {
    return res.status(500).json({ message: "Failed to create cryptocurrency." });
  }
};

export { getAllCrypto, getTopGainers, getNewListings, createCrypto };
