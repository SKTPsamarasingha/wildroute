declare global {
    namespace NodeJS {
        interface ProcessEnv {
            FIREBASE_API_KEY: string;
            FIREBASE_AUTH_DOMAIN: string;
            FIREBASE_PROJECT_ID: string;
            FIREBASE_STORAGE_BUCKET: string;
            FIREBASE_MESSAGING_SENDER_ID: string;
            FIREBASE_APP_ID: string;

            FIREBASE_CLIENT_EMAIL: string;
            FIREBASE_PRIVATE_KEY: string;


            CLOUDINARY_CLOUD_NAME: string;
            CLOUDINARY_API_KEY: string;
            CLOUDINARY_API_SECRET: string;

            JWT_ACCESS_SECRET:string;
            JWT_REFRESH_SECRET:string;
        }
    }
}

export {};
