import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { SESService } from '../../../src/common/aws/ses.service';
import { ConfigService } from '@nestjs/config';
import { SendEmailCommand } from '@aws-sdk/client-ses';
import { AWS_CLIENTS } from '../../../src/common/constants/aws.constants';
import { AwsErrorMessages } from '../../../src/common/constants/error-messages/aws-error-messages';

describe('SESService', () => {
  let service: SESService;
  let sesClientMock: { send: jest.Mock };
  let loggerErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    sesClientMock = { send: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SESService,
        {
          provide: AWS_CLIENTS.SES,
          useValue: sesClientMock,
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('no-reply@example.com'),
          },
        },
      ],
    }).compile();

    service = module.get<SESService>(SESService);
    loggerErrorSpy = jest.spyOn((service as any).logger, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email', async () => {
    sesClientMock.send.mockResolvedValue({});

    await service.sendEmail(['user@example.com'], 'Subject', '<p>Hello</p>', 'Hello');

    expect(sesClientMock.send).toHaveBeenCalledWith(expect.any(SendEmailCommand));
  });

  it('should log and throw error on sendEmail failure', async () => {
    const error = new Error('SES send failed');
    sesClientMock.send.mockRejectedValue(error);

    await expect(
      service.sendEmail(['user@example.com'], 'Subject', '<p>Hello</p>', 'Hello'),
    ).rejects.toThrow(error);

    expect(loggerErrorSpy).toHaveBeenCalledWith(AwsErrorMessages.SES.SEND_EMAIL_ERROR, error);
  });
});
