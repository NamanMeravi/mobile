import express from "express";
import { getProfile, updateProfileImage, deleteAccount } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", protectRoute, getProfile);
router.put("/profile/image", protectRoute, updateProfileImage);
router.delete("/", protectRoute, deleteAccount);

export default router;
