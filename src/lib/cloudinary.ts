import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  resource_type: 'image' | 'video';
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string;
    resourceType?: 'image' | 'video' | 'auto';
  } = {}
): Promise<CloudinaryUploadResult> {
  const { folder = 'depenados', resourceType = 'auto' } = options;

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: resourceType,
          transformation: resourceType === 'image' ? [
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ] : undefined,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result as CloudinaryUploadResult);
          } else {
            reject(new Error('Upload falhou sem resultado'));
          }
        }
      )
      .end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
