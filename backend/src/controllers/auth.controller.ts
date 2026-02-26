import {type Request, type Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../db/index.js";
import { users } from "../db/schema/user.js"
import { eq } from "drizzle-orm";
import { generateToken } from "../utils/jwt.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password, profileImage } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        profileImage: profileImage || "",
      })
      .returning();

    const token = generateToken(newUser[0]!.id);

    res.status(201).json({
      message: "Signup successful",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Signup failed",
      error,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (user.length === 0) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user[0]!.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user[0]!.id);

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
    });
  }
};