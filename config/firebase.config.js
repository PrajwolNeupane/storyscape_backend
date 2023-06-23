import * as dotenv from 'dotenv';
dotenv.config()


export default {
    firebaseConfig: {
        apiKey: process.env.FIRE_API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID
    },
}