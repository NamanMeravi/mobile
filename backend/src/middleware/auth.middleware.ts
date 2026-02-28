import {type Request, type Response,type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { users } from "../db/schema/user.js";
import { eq } from "drizzle-orm";

interface JwtPayload {
  userId: string;
}

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });
    }

    const token = authHeader.split(" ")[1]!;

    const decoded = jwt.verify(
      token ,
      process.env.JWT_SECRET as string
    ) as unknown as JwtPayload;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (!user.length) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    // attach user to request
    (req as any).user = user[0];

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Token is not valid" });
  }
};