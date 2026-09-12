import express from "express";
import {
  getConversationsForSidebar,
  getMessagesForChat,
  getUsersForSidebar,
  sendMessage,
} from "../controller/message.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { upload } from './../middleware/upload.middleware.js';

const router = express.Router();

router.use(protectedRoute);

router.get("/users", getUsersForSidebar);
router.get("/conversations", getConversationsForSidebar);
router.get("/:id", getMessagesForChat);
router.post("/send", getMessagesForChat);
router.post("/send:id",upload.single("media"),sendMessage)

export default router;
