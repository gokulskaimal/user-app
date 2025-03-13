import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Admin check (avoid querying MongoDB for "admin-id")
    if (decoded.id === "admin-id") {
      req.user = {
        _id: "admin-id",
        username: "Admin",
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      };
      return next();
    }

    // Normal user lookup in database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    // If the logged-in user is admin, return hardcoded details
    if (req.user._id === "admin-id") {
      return res.json({
        _id: "admin-id",
        username: "Admin",
        email: process.env.ADMIN_EMAIL,
        role: "admin",
        profileImage: null, // Admin might not have an image
      });
    }

    // Otherwise, fetch user from DB
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};