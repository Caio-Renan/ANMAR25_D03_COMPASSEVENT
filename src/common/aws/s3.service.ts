import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AWS_CLIENTS } from '@constants/aws.constants';
import { AwsErrorMessages } from '@constants/error-messages/aws-error-messages';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Base64Image } from '@vo/base64-image.vo';

@Injectable()
export class S3Service {
  private readonly bucket: string;
  private readonly logger = new Logger(S3Service.name);
  private readonly usersOriginalsFolder: string;
  private readonly usersResizedFolder: string;
  private readonly eventsOriginalsFolder: string;
  private readonly eventsResizedFolder: string;

  constructor(
    @Inject(AWS_CLIENTS.S3)
    private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {
    this.bucket = this.configService.getOrThrow<string>('s3.bucketName');
    this.usersOriginalsFolder = this.configService.getOrThrow<string>('s3.usersFolderOriginals');
    this.usersResizedFolder = this.configService.getOrThrow<string>('s3.usersFolderResized');
    this.eventsOriginalsFolder = this.configService.getOrThrow<string>('s3.eventsFolderOriginals');
    this.eventsResizedFolder = this.configService.getOrThrow<string>('s3.eventsFolderResized');
  }

  async uploadBase64Image(key: string, base64Image: Base64Image, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: base64Image.toBuffer(),
      ContentType: contentType,
    });

    try {
      await this.s3Client.send(command);
      return {
        key,
        url: this.getPublicUrl(key),
      };
    } catch (error) {
      this.logger.error(AwsErrorMessages.S3.UPLOAD_BASE64_FILE_ERROR(key), error);
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

  getUsersOriginalsFolder(): string {
    return this.usersOriginalsFolder;
  }

  getUsersResizedFolder(): string {
    return this.usersResizedFolder;
  }

  getEventsOriginalsFolder(): string {
    return this.eventsOriginalsFolder;
  }

  getEventsResizedFolder(): string {
    return this.eventsResizedFolder;
  }
}
