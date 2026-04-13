import client from "./client";

export const signup = (username: string, email: string, password: string) =>
  client.post("/auth/signup", { username, email, password });

export const login = (email: string, password: string) =>
  client.post("/auth/login", { email, password });
