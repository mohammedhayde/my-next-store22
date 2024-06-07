import AWS from 'aws-sdk';

// تكوين AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'AKIA4MTWISTDQXZ4ERNR',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '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',
  region: process.env.AWS_REGION || 'eu-central-1',
});

const s3 = new AWS.S3();

export const uploadToS3 = async (key: string, body: Buffer | Uint8Array | Blob | string, contentType: string): Promise<string> => {
  const params = {
    Bucket: 'un4software',
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
    Bucket: 'un4software',
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
