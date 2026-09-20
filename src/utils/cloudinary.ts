import {cloudinary} from '../lib/cloudinary';

interface UploadResult {
    imageUrl: string;
    imagePublicId: string;
}

/**
 * Uploads a file to Cloudinary and returns the optimized URL data
 * @param fileData - Base64 data string, local filepath, or buffer
 * @param folderName - The folder inside Cloudinary (e.g., 'products', 'categories')
 */
export const uploadToCloudinary = async (fileData: string, folderName: string): Promise<UploadResult> => {
    try {
        const response = await cloudinary.uploader.upload(fileData, {
            folder: `ecommerce/${folderName}`,
            // ⚡ Automatically optimizes images for web speed
            transformation: [
                {width: 1000, height: 1000, crop: 'limit'}, // Keeps images from being too massive
                {quality: 'auto'},                         // Compresses file size cleanly
                {fetch_format: 'auto'}                     // Delivers WebP/AVIF if browser supports it
            ]
        });

        return {
            imageUrl: response.secure_url, // Use this for your database record
            imagePublicId: response.public_id // Save this so you can delete the image later if needed
        };
    } catch (error) {
        console.error("❌ [Cloudinary Upload Error]: Failed to push media asset.");
        throw error;
    }
};
