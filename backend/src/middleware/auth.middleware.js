import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectedRoute middleware");
    res.status(500).json({ message: "Internal server error" });
  }
};
