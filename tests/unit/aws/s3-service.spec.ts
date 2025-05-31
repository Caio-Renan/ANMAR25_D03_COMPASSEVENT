import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { S3Service } from '../../../src/common/aws/s3.service';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

import { AWS_CLIENTS } from '../../../src/common/constants/aws.constants';
import { AwsErrorMessages } from '../../../src/common/constants/error-messages/aws-error-messages';

describe('S3Service', () => {
  let service: S3Service;
  let s3ClientMock: { send: jest.Mock };
  let configServiceMock: { getOrThrow: jest.Mock; get: jest.Mock };
  let loggerErrorSpy: jest.SpyInstance;

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

    const result = await service.uploadFile('file.txt', Buffer.from('hello'), 'text/plain');

    expect(s3ClientMock.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
    expect(result).toEqual({
      key: 'file.txt',
      url: 'https://my-bucket.s3.us-east-1.amazonaws.com/file.txt',
    });
  });

  it('should log and throw error on uploadFile failure', async () => {
    const error = new Error('S3 upload failed');
    s3ClientMock.send.mockRejectedValue(error);

    await expect(
      service.uploadFile('file.txt', Buffer.from('hello'), 'text/plain'),
    ).rejects.toThrow(error);

    expect(loggerErrorSpy).toHaveBeenCalledWith(AwsErrorMessages.S3.UPLOAD_FILE_ERROR, error);
  });

  it('should delete a file', async () => {
    s3ClientMock.send.mockResolvedValue({});

    await service.deleteFile('file.txt');

    expect(s3ClientMock.send).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));
  });

  it('should log and throw error on deleteFile failure', async () => {
    const error = new Error('S3 delete failed');
    s3ClientMock.send.mockRejectedValue(error);

    await expect(service.deleteFile('file.txt')).rejects.toThrow(error);

    expect(loggerErrorSpy).toHaveBeenCalledWith(AwsErrorMessages.S3.DELETE_FILE_ERROR, error);
  });

  it('should get public URL', () => {
    const result = service.getPublicUrl('file.txt');

    expect(result).toBe('https://my-bucket.s3.us-east-1.amazonaws.com/file.txt');
  });

  it('should upload a base64 file', async () => {
    s3ClientMock.send.mockResolvedValue({});

    const base64 = Buffer.from('hello').toString('base64');

    const result = await service.uploadBase64File('file.txt', base64, 'text/plain');

    expect(s3ClientMock.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
    expect(result).toEqual({
      key: 'file.txt',
      url: 'https://my-bucket.s3.us-east-1.amazonaws.com/file.txt',
    });
  });

  it('should log and throw error on uploadBase64File failure', async () => {
    const error = new Error('S3 upload failed');
    s3ClientMock.send.mockRejectedValue(error);

    const base64 = Buffer.from('hello').toString('base64');

    await expect(service.uploadBase64File('file.txt', base64, 'text/plain')).rejects.toThrow(error);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      AwsErrorMessages.S3.UPLOAD_BASE64_FILE_ERROR,
      error,
    );
  });
});
