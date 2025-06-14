/* import AWS from "aws-sdk";

export async function uploadToS3(file: File) {
  try {
    // Check if environment variables are set
    if (
      !process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID ||
      !process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY_ID ||
      !process.env.NEXT_PUBLIC_S3_BUCKET_NAME
    ) {
      throw new Error(
        "AWS credentials or bucket name are not set in environment variables"
      );
    }

    // Update AWS config
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY_ID,
      region: "ap-south-1", // Ensure region is set here
    });

    const s3 = new AWS.S3();

    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: file_key,
      Body: file,
    };

    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        if (evt.total) {
          console.log(
            "Uploading to S3...",
            Math.floor((evt.loaded * 100) / evt.total).toString() + "%"
          );
        }
      })
      .promise();

    await upload.then((data) => {
      console.log("Successfully uploaded to S3!", file_key);
    });

    return {
      file_key,
      file_name: file.name,
    };
  } catch (error) {
    console.error("Error uploading to S3", error);
    throw error; // Re-throw the error after logging it
  }
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`;
  return url;
}
 */

/* import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
 */
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
export async function uploadToS3(file: File) {
  try {
    // Check if environment variables are set
    if (
      !process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID ||
      !process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY_ID ||
      !process.env.NEXT_PUBLIC_S3_BUCKET_NAME
    ) {
      throw new Error(
        "AWS credentials or bucket name are not set in environment variables"
      );
    }

    // Initialize S3 client
    const s3Client = new S3Client({
      region: "ap-south-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY_ID!,
      },
    });

    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: file,
    };

    const command = new PutObjectCommand(params);
    const upload = await s3Client.send(command);

    console.log("Successfully uploaded to S3!", file_key);

    return {
      file_key,
      file_name: file.name,
    };
  } catch (error) {
    console.error("Error uploading to S3", error);
    throw error; // Re-throw the error after logging it
  }
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`;
  return url;
}
