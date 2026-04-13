import { type Request, type Response } from "express";
import { db } from "../db/index.js";
import { books, users } from "../db/schema/index.js";
import { eq, desc } from "drizzle-orm";
import { uploadToCloudinary, deleteFromCloudinary } from "../services/cloudinary.service.js";

export const addBook = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { title, caption, image, rating } = req.body;

    if (!title || !caption || !image || rating === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const result = await uploadToCloudinary(image, "book-store/books");

    const [newBook] = await db
      .insert(books)
      .values({
        title,
        caption,
        image: result.secure_url,
        rating: Number(rating),
        userId: user.id,
      })
      .returning();

    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    res.status(500).json({ message: "Failed to add book", error });
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await db
      .select({
        id: books.id,
        title: books.title,
        caption: books.caption,
        image: books.image,
        rating: books.rating,
        createdAt: books.createdAt,
        user: {
          id: users.id,
          username: users.username,
          profileImage: users.profileImage,
        },
      })
      .from(books)
      .innerJoin(users, eq(books.userId, users.id))
      .orderBy(desc(books.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({ books: result, page, limit });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books", error });
  }
};

export const getUserBooks = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const result = await db
      .select()
      .from(books)
      .where(eq(books.userId, user.id))
      .orderBy(desc(books.createdAt));

    res.json({ books: result });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user books", error });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const id = req.params.id as string;
    const { title, caption, rating } = req.body;

    const [book] = await db
      .select()
      .from(books)
      .where(eq(books.id, id!))
      .limit(1);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.userId !== user.id) {
      return res.status(403).json({ message: "Not authorized to update this book" });
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const [updated] = await db
      .update(books)
      .set({
        ...(title && { title }),
        ...(caption && { caption }),
        ...(rating !== undefined && { rating: Number(rating) }),
      })
      .where(eq(books.id, id!))
      .returning();

    res.json({ message: "Book updated successfully", book: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update book", error });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const id = req.params.id as string;

    const [book] = await db
      .select()
      .from(books)
      .where(eq(books.id, id!))
      .limit(1);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.userId !== user.id) {
      return res.status(403).json({ message: "Not authorized to delete this book" });
    }

    await deleteFromCloudinary(book.image).catch(() => {});

    await db.delete(books).where(eq(books.id, id!));

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete book", error });
  }
};
