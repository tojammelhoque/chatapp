// import express from "express";
// import User from "../models/user.model.js";
// import { verifyWebhook } from "@clerk/bakend/webhooks";

// const router = express.Router();

// router.post("/", async (req, res) => {
//   try{
//     const singinSecret = process.env.CLERK_SIGNIN_SECRET_KEY;
//   if (!singinSecret) throw new Error("Missing CLERK_SIGNIN_SECRET_KEY");

//   const payload = Buffer.isBuffer(req.body)
//     ? req.body.toString("utf-8")
//     : String(req.body);
//   const request = new Request("http:internal/webhooks/clerk", {
//     method: "POST",
//     headers: new Headers(req.headers),
//     body: payload,
//   });

//   const evt = await verifyWebhook(request, { singinSecret });
//   if (evt.type === "user.created" || evt.type === "user.updated") {
//     const user = evt.data;
//     const email =
//       user.email_addresses?.((e) => e.id === user.primary_email_address_id)
//         ?.email_address ?? user.email_addresses?.[0]?.email_address;
//   }

//   const fullName =
//     [user.first_name, u.last_name].filter(Boolean).join(" ") ||
//     user.username ||
//     email?.split("@")[0];
//   await User.findOneAndUpdate(
//     { clerkId: user.id },
//     { email, fullName, profilePic: user.image_url },
//     { new: true, upsert: true, setDefaultsOnInsert: true },
//   );

//   if (evt.type === "user.delete") {
//     if (evt.data.id) await User.findOneAndDelete({ clerkId: evt.data.id });
//   }

//   res.status(200).json({ recived: true });
//   }
//   catch (error) {
//     console.error(error);
//     res.status(400).json({ message: "Webhook verification failed" });
//   }
// });

// export default router;

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
