import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { S3Service } from '../../../src/common/aws/s3.service';
import { AWS_CLIENTS } from '../../../src/common/constants/aws.constants';
import { AwsErrorMessages } from '../../../src/common/constants/error-messages/aws-error-messages';

describe('S3Service', () => {
  let service: S3Service;
  let s3ClientMock: { send: jest.Mock };
  let configServiceMock: { getOrThrow: jest.Mock; get: jest.Mock };
  let loggerErrorSpy: jest.SpyInstance;
  const key = 'file.txt';
  const awsBucketName = 'my-bucket';
  const awsRegion = 'us-east-1';
  const bucketBaseUrl = `https://${awsBucketName}.s3.${awsRegion}.amazonaws.com/`;
  const url = `${bucketBaseUrl}${key}`;
  const encondingBase64 = 'base64';
  const mimeType = 'text/plain';
  const fileContent = 'hello';

  beforeEach(async () => {
    s3ClientMock = { send: jest.fn() };
    configServiceMock = {
      getOrThrow: jest.fn().mockReturnValue('my-bucket'),
      get: jest.fn().mockReturnValue('us-east-1'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        {
          provide: AWS_CLIENTS.S3,
          useValue: s3ClientMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<S3Service>(S3Service);
    loggerErrorSpy = jest.spyOn((service as any).logger, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should upload a file', async () => {
    s3ClientMock.send.mockResolvedValue({});

    const result = await service.uploadFile(key, Buffer.from(fileContent), mimeType);

    expect(s3ClientMock.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
    expect(result).toEqual({
      key: key,
      url: url,
    });
  });

  it('should log and throw error on uploadFile failure', async () => {
    const error = new Error('S3 upload failed');
    s3ClientMock.send.mockRejectedValue(error);

    await expect(service.uploadFile(key, Buffer.from(fileContent), mimeType)).rejects.toThrow(
      error,
    );

    expect(loggerErrorSpy).toHaveBeenCalledWith(AwsErrorMessages.S3.UPLOAD_FILE_ERROR(key), error);
  });

  it('should delete a file', async () => {
    s3ClientMock.send.mockResolvedValue({});

    await service.deleteFile(key);

    expect(s3ClientMock.send).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));
  });

  it('should log and throw error on deleteFile failure', async () => {
    const error = new Error('S3 delete failed');
    s3ClientMock.send.mockRejectedValue(error);

    await expect(service.deleteFile(key)).rejects.toThrow(error);

    expect(loggerErrorSpy).toHaveBeenCalledWith(AwsErrorMessages.S3.DELETE_FILE_ERROR(key), error);
  });

  it('should get public URL', () => {
    const result = service.getPublicUrl(key);

    expect(result).toBe(url);
  });

  it('should upload a base64 file', async () => {
    s3ClientMock.send.mockResolvedValue({});

    const base64 = Buffer.from(fileContent).toString(encondingBase64);

    const result = await service.uploadBase64File(key, base64, mimeType);

    expect(s3ClientMock.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
    expect(result).toEqual({
      key: key,
      url: url,
    });
  });

  it('should log and throw error on uploadBase64File failure', async () => {
    const error = new Error('S3 upload failed');
    s3ClientMock.send.mockRejectedValue(error);

    const base64 = Buffer.from(fileContent).toString(encondingBase64);

    await expect(service.uploadBase64File(key, base64, mimeType)).rejects.toThrow(error);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      AwsErrorMessages.S3.UPLOAD_BASE64_FILE_ERROR(key),
      error,
    );
  });
});
