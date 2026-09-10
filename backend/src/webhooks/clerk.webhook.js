

import express from "express";
import User from "../models/user.model.js";
import { verifyWebhook } from "@clerk/express/webhooks";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const user = evt.data;

      const email =
        user.email_addresses?.find(
          (e) => e.id === user.primary_email_address_id,
        )?.email_address ?? user.email_addresses?.[0]?.email_address;

      const fullName =
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        user.username ||
        email?.split("@")[0] ||
        "User";

      await User.findOneAndUpdate(
        { clerkId: user.id },
        {
          email,
          fullName,
          profilePic: user.image_url,
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      );
    }

    if (evt.type === "user.deleted") {
      if (evt.data.id) {
        await User.findOneAndDelete({
          clerkId: evt.data.id,
        });
      }
    }

    res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error("Clerk webhook verification failed:", error);

    res.status(400).json({
      message: "Webhook verification failed",
    });
  }
});

export default router;
