import express from "express";
import { addBook, getBooks, getUserBooks, deleteBook } from "../controllers/book.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, addBook);
router.get("/", protectRoute, getBooks);
router.get("/user", protectRoute, getUserBooks);
router.delete("/:id", protectRoute, deleteBook);

export default router;
