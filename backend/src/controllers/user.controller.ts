import { type Request, type Response } from "express";
import { db } from "../db/index.js";
import { users, books } from "../db/schema/index.js";
import { eq, and, ne } from "drizzle-orm";
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

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { username, email } = req.body;

    if (!username && !email) {
      return res.status(400).json({ message: "At least one field is required" });
    }

    if (email && email !== user.email) {
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existing.length > 0) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    if (username && username !== user.username) {
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      if (existing.length > 0) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    const [updated] = await db
      .update(users)
      .set({
        ...(username && { username }),
        ...(email && { email }),
      })
      .where(eq(users.id, user.id))
      .returning();

    const { password, ...safeUser } = updated!;

    res.json({ message: "Profile updated", user: safeUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error });
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

    // Fetch all user's books to clean up their cloudinary images
    const userBooks = await db
      .select()
      .from(books)
      .where(eq(books.userId, user.id));

    await Promise.all(
      userBooks.map((book) => deleteFromCloudinary(book.image).catch(() => {}))
    );

    // Delete profile image from cloudinary if present
    if (user.profileImage) {
      await deleteFromCloudinary(user.profileImage).catch(() => {});
    }

    // Cascade delete removes books from DB
    await db.delete(users).where(eq(users.id, user.id));

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete account", error });
  }
};
