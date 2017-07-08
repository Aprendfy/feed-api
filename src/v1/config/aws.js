import S3 from 'aws-sdk/clients/s3';

const { AWS_ACCESS_KEY, AWS_SECRET_KEY } = process.env;
export const { AWS_S3_BUCKET_NAME } = process.env;

export default new S3({ accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY });
