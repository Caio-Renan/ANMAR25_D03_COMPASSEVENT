import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AWS_CLIENTS } from '../constants/aws.constants';
import { AwsErrorMessages } from '../constants/error-messages/aws-error-messages';
import { Base64Image } from '../value-objects/base64-image.vo';

@Injectable()
export class S3Service {
  private readonly bucket: string;
  private readonly logger = new Logger(S3Service.name);

  constructor(
    @Inject(AWS_CLIENTS.S3)
    private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {
    this.bucket = this.configService.getOrThrow<string>('aws.s3Bucket');
  }

  async uploadFile(key: string, body: Buffer, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    try {
      await this.s3Client.send(command);
      return { key, url: this.getPublicUrl(key) };
    } catch (error) {
      this.logger.error(AwsErrorMessages.S3.UPLOAD_FILE_ERROR(key), error);
      throw error;
    }
  }

  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      this.logger.error(AwsErrorMessages.S3.DELETE_FILE_ERROR(key), error);
      throw error;
    }
  }

  getPublicUrl(key: string) {
    const region = this.configService.get<string>('aws.region');
    return `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`;
  }

  async uploadBase64File(key: string, base64: string, contentType: string) {
    try {
      const buffer = new Base64Image(base64).toBuffer();
      return await this.uploadFile(key, buffer, contentType);
    } catch (error) {
      this.logger.error(AwsErrorMessages.S3.UPLOAD_BASE64_FILE_ERROR(key), error);
      throw error;
    }
  }
}
