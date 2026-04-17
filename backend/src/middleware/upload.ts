import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Request } from 'express';

// Use memory storage - we'll upload buffer to Cloudinary manually
const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

/**
 * Uploads a file buffer to Cloudinary and returns the result.
 */
export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string = 'kpaint/paintings'
): Promise<{ url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Cloudinary upload failed'));
        } else {
          resolve({ url: result.secure_url, public_id: result.public_id });
        }
      }
    );
    stream.end(buffer);
  });
};

/**
 * Deletes an image from Cloudinary by its public_id.
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};
