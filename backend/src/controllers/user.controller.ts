import { type Request, type Response } from "express";
import { db } from "../db/index.js";
import { users } from "../db/schema/index.js";
import { eq } from "drizzle-orm";
import { uploadToCloudinary, deleteFromCloudinary } from "../services/cloudinary.service.js";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const { password, ...safeUser } = user;

    res.json({ user: safeUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error });
  }
};

export const updateProfileImage = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Delete old image from cloudinary if it exists
    if (user.profileImage) {
      await deleteFromCloudinary(user.profileImage).catch(() => {});
    }

    const result = await uploadToCloudinary(image, "book-store/profiles");

    const [updated] = await db
      .update(users)
      .set({ profileImage: result.secure_url })
      .where(eq(users.id, user.id))
      .returning();

    const { password, ...safeUser } = updated!;

    res.json({ message: "Profile image updated", user: safeUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile image", error });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    // Delete profile image from cloudinary if present
    if (user.profileImage) {
      await deleteFromCloudinary(user.profileImage).catch(() => {});
    }

    // Cascade delete will remove books and their data
    await db.delete(users).where(eq(users.id, user.id));

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete account", error });
  }
};
