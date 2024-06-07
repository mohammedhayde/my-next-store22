import AWS from 'aws-sdk';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة من ملف .env
dotenv.config();

// طباعة المتغيرات للتحقق من تحميلها
console.log('AWS_ACCESS_KEY_ID:', process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY:', process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY);
console.log('AWS_REGION:', process.env.NEXT_PUBLIC_AWS_REGION);
console.log('NEXT_PUBLIC_AWS_BUCKET_NAME:', process.env.NEXT_PUBLIC_AWS_BUCKET_NAME);


// تكوين AWS SDK باستخدام متغيرات البيئة
AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-central-1',
});

const s3 = new AWS.S3();

export const uploadToS3 = async (key: string, body: Buffer | Uint8Array | Blob | string, contentType: string): Promise<string> => {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
    Key: key,
    Body: body,
    ContentType: contentType,
  };

  try {
    console.log('Uploading to S3:', params); // Debug log
    const data = await s3.upload(params).promise();
    console.log('Upload successful:', data); // Debug log
    return data.Location; // رابط الملف في S3
  } catch (err) {
    console.error('Error uploading to S3:', err); // Debug log
    throw new Error('Error uploading to S3');
  }
};

export const deleteFromS3 = async (key: string): Promise<void> => {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
    Key: key,
  };

  try {
    console.log('Deleting from S3:', params); // Debug log
    await s3.deleteObject(params).promise();
    console.log('Delete successful'); // Debug log
  } catch (err) {
    console.error('Error deleting from S3:', err); // Debug log
    throw new Error('Error deleting from S3');
  }
};
