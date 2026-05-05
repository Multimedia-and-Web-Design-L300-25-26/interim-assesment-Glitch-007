/* global process */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const sendTokenResponse = (res, user, message, statusCode = 200) => {
  const token = generateToken(user._id);
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(statusCode).json({
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
};

const registerUser = async (req, res) => {
  try {
    const payload = req.method === "GET" ? req.query : req.body;
    const { name, email, password } = payload;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return sendTokenResponse(res, user, "Registration successful.", 201);
  } catch {
    return res.status(500).json({ message: "Registration failed." });
  }
};

const loginUser = async (req, res) => {
  try {
    const payload = req.method === "GET" ? req.query : req.body;
    const { email, password } = payload;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return sendTokenResponse(res, user, "Login successful.");
  } catch {
    return res.status(500).json({ message: "Login failed." });
  }
};

const getProfile = async (req, res) => {
  return res.status(200).json({
    message: "Profile fetched successfully.",
    user: req.user,
  });
};

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.status(200).json({ message: "Logged out successfully." });
};

export { registerUser, loginUser, getProfile, logoutUser };
