import cloudinary from '../config/cloudinary.js'

export const uploadToCloudinary = async (fileData: string, folder: string = "book-store") => {
  return await cloudinary.uploader.upload(fileData, { folder });
};

// Legacy alias
export const uploadCloudinary = uploadToCloudinary;

export const deleteFromCloudinary = async (imageUrl: string) => {
  // Extract public_id (e.g. "book-store/abc123") from the cloudinary URL
  const parts = imageUrl.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex === -1) return;

  let startIndex = uploadIndex + 1;
  // Skip version segment like "v1234567890"
  if (parts[startIndex]?.match(/^v\d+$/)) startIndex++;  

  const publicId = parts.slice(startIndex).join('/').replace(/\.[^.]+$/, '');
  return await cloudinary.uploader.destroy(publicId);
};