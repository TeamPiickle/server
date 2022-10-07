import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port
   */

  port: parseInt(process.env.PORT as string, 10),

  /**
   * jwt
   */
  jwtSecret: process.env.JWT_SECRET as string,
  jwtAlgo: process.env.JWT_ALGO as string,

  /**
   * MongoDB URI
   */
  mongoURI: process.env.MONGODB_URI as string,
  mongoTestURI: process.env.MONGODB_TEST_URI as string,
  defaultProfileImgUrl: process.env.DEFAULT_PROFILE_IMG_URL as string,

  /**
   * s3
   */
  s3AccessKey: process.env.S3_ACCESS_KEY as string,
  s3SecretKey: process.env.S3_SECRET_KEY as string,
  bucketName: process.env.BUCKET_NAME as string,

  slackWebHookUrl: process.env.SLACK_WEBHOOK as string,

  firebase: {
    apiKey: process.env.FIREBASE_API_KEY as string,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN as string,
    projectId: process.env.FIREBASE_PROJECT_ID as string,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID as string,
    appId: process.env.FIREBASE_APP_ID as string,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID as string
  },
  emailRedirectionUrl: {
    prod: process.env.SIGN_UP_REDIRECTION_PROD_URL as string,
    dev: process.env.SIGN_UP_REDIRECTION_DEV_URL as string
  },
  clientKey: process.env.CLIENT_KEY as string
};
