import { v2 as cloudinary } from 'cloudinary';

const requiredCloudinaryKeys = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'] as const;
const missingCloudinaryKeys = requiredCloudinaryKeys.filter(key => !process.env[key]);

if (missingCloudinaryKeys.length > 0) {
    console.error(`❌ [Cloudinary Config Error]: Missing environment variables: ${missingCloudinaryKeys.join(', ')}`);
}

try {
    // Configure the Cloudinary instance global settings
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true, // Forces HTTPS for asset URLs
    });

    console.log("☁️ [Cloudinary Status]: Instance configured successfully with secure connections.");
} catch (error) {
    console.error("🚨 [Cloudinary Configuration Failed]: Check server setup configurations.");
    if (error instanceof Error) {
        console.error(`📋 SDK Error Message: ${error.message}`);
    }
}

// Export the configured instance for backend image uploading routes
export { cloudinary };
