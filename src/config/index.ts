import dotenv from 'dotenv';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const NODE_ENV = process.env.NODE_ENV || 'development';

const MONGO_URI =
  NODE_ENV == 'production'
    ? process.env.MONGODB_URI
    : process.env.MONGODB_DEVELOPMENT_URI;

const WEB_APP_URL =
  NODE_ENV == 'production'
    ? process.env.WEB_APP_URL
    : process.env.WEB_APP_DEV_URL;

export default {
  nodeEnv: NODE_ENV,
  port: parseInt(process.env.PORT as string, 10),

  /**
   * session key
   */
  sessionKey: process.env.SESSION_SECRET_KEY as string,

  /**
   * jwt
   */
  jwtSecret: process.env.JWT_SECRET as string,
  jwtAlgo: process.env.JWT_ALGO as string,

  /**
   * MongoDB URI
   */
  mongoURI: MONGO_URI as string,
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
  clientKey: process.env.CLIENT_KEY as string,
  naverClientId: process.env.NAVER_CLIENT_ID as string,
  naverClientSecret: process.env.NAVER_CLIENT_SECRET as string,
  sentryDsn: process.env.SENTRY_DSN as string,
  /**
   * piickle service application url
   */
  webAppUrl: WEB_APP_URL as string,
  imageServerUrl: process.env.IMAGE_SERVER_URL as string
};
