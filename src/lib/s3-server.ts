import { S3 } from "@aws-sdk/client-s3";
import fs from "fs";
import { Readable } from "stream";

export async function downloadFromS3(file_key: string): Promise<string | null> {
  try {
    console.log("Initializing S3 client");
    const s3 = new S3({
      region: "ap-southeast-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
      },
    });

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
    };

    console.log("Fetching object from S3:", params);
    const obj = await s3.getObject(params);

    if (!obj.Body) {
      throw new Error("S3 object body is undefined");
    }

    const file_name = `/tmp/elliott${Date.now().toString()}.pdf`;
    console.log("Generated file name:", file_name);

    const bodyStream = obj.Body as Readable;

    const file = fs.createWriteStream(file_name);
    console.log("Writing file to local file system");

    return new Promise((resolve, reject) => {
      bodyStream
        .pipe(file)
        .on("finish", () => {
          console.log("File download complete");
          resolve(file_name);
        })
        .on("error", (err: any) => {
          console.error("Error writing file:", err);
          reject(err);
        });
    });
  } catch (error) {
    console.error("Error downloading file from S3:", error);
    return null;
  }
}
