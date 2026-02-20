import { IObjectStorageService } from "../services/IObjectStorageService";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export class S3ObjectStorageService implements IObjectStorageService {
  constructor(
    private readonly s3: S3Client,
    private readonly bucket: string,
  ) {}

  async download(key: string): Promise<Buffer> {
    const result = await this.s3.send(
      new GetObjectCommand({ 
        Bucket: this.bucket,
        Key: key
      })
    );

    const array = await result.Body?.transformToByteArray();
    if (!array) throw new Error("Failed to download object");
    return Buffer.from(array);
  }1
}
