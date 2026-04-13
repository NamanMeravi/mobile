import client from "./client";

export const getBooks = (page: number = 1, limit: number = 10) =>
  client.get("/books", { params: { page, limit } });

export const getUserBooks = () =>
  client.get("/books/user");

export const addBook = (data: { title: string; caption: string; image: string; rating: number }) =>
  client.post("/books", data);

export const updateBook = (id: string, data: { title?: string; caption?: string; rating?: number }) =>
  client.put(`/books/${id}`, data);

export const deleteBook = (id: string) =>
  client.delete(`/books/${id}`);
