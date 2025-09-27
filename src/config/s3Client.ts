import { S3Client } from '@aws-sdk/client-s3';
import config from '.';

const s3: S3Client = new S3Client({
  credentials: {
    accessKeyId: config.s3AccessKey,
    secretAccessKey: config.s3SecretKey
  },

  region: 'ap-northeast-2'
});

export { s3 };
