import express from "express"
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadProfileImage,
  searchUsers,
  createUser, // Add this import
} from "../controllers/userController.js"
import { protect, admin } from "../middleware/auth.js"

const router = express.Router()

// Admin routes
router.post("/", protect, admin, createUser) // Add this new route
router.get("/", protect, admin, getUsers)
router.get("/search", protect, admin, searchUsers)
router.get("/:id", protect, admin, getUserById)
router.put("/:id", protect, admin, updateUser)
router.delete("/:id", protect, admin, deleteUser)

// User routes
router.post("/upload", protect, uploadProfileImage)

export default router

