import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addContact, deleteContact, searchUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/search", protectRoute, searchUsers);

router.post("/add", protectRoute, addContact);

router.delete("/remove/:id", protectRoute, deleteContact);

export default router;