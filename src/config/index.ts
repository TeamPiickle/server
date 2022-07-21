import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port
   */

  env: process.env.NODE_ENV as string,
  port: parseInt(process.env.PORT as string, 10),

  /**
   * jwt
   */
  jwtSecret: process.env.JWT_SECRET as string,
  jwtAlgo: process.env.JWT_ALGO as string,

  /**
   * MongoDB URI
   */

  /**
   * s3
   */
  s3AccessKey: process.env.S3_ACCESS_KEY as string,
  s3SecretKey: process.env.S3_SECRET_KEY as string,
  bucketName: process.env.BUCKET_NAME as string,

  mongoURI: process.env.MONGODB_URI as string,
  mongoTestURI: process.env.MONGODB_TEST_URI as string,
  defaultProfileImgUrl: process.env.DEFAULT_PROFILE_IMG_URL as string
};
