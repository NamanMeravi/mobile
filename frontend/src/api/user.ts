import client from "./client";

export const getProfile = () =>
  client.get("/user/profile");

export const updateProfile = (data: { username?: string; email?: string }) =>
  client.put("/user/profile", data);

export const updateProfileImage = (image: string) =>
  client.put("/user/profile/image", { image });

export const deleteAccount = () =>
  client.delete("/user");
