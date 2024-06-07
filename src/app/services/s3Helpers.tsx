import AWS from 'aws-sdk';

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

export const deleteFolderFromS3 = async (folderKey: string): Promise<void> => {
  const listParams = {
    Bucket: 'un4software',
    Prefix: folderKey,
  };

  try {
    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;

    const deleteParams = {
      Bucket: 'un4software',
      Delete: { Objects: [] as { Key: string }[] },
    };

    listedObjects.Contents.forEach(({ Key }) => {
      if (Key) {
        deleteParams.Delete.Objects.push({ Key });
      }
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) {
      await deleteFolderFromS3(folderKey);
    }

    console.log('Folder delete successful'); // Debug log
  } catch (err) {
    console.error('Error deleting folder from S3:', err); // Debug log
    throw new Error('Error deleting folder from S3');
  }
};
