/*import { SendEmailCommand } from '@aws-sdk/client-ses';
import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { SESService } from '../../../src/common/aws/ses.service';
import { AWS_CLIENTS } from '../../../src/common/constants/aws.constants';
import { AwsErrorMessages } from '../../../src/common/constants/error-messages/aws-error-messages';

describe('SESService', () => {
  let service: SESService;
  let sesClientMock: { send: jest.Mock };
  let configServiceMock: { getOrThrow: jest.Mock };
  let loggerErrorSpy: jest.SpyInstance;
  const to = ['user@example.com'];
  const subject = 'Subject';
  const htmlContent = '<p>Hello</p>';
  const plainText = 'Hello';

  beforeEach(async () => {
    sesClientMock = { send: jest.fn() };
    configServiceMock = {
      getOrThrow: jest.fn().mockReturnValue('no-reply@example.com'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SESService,
        {
          provide: AWS_CLIENTS.SES,
          useValue: sesClientMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
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

    await service.sendEmail(to, subject, htmlContent, plainText);

    expect(sesClientMock.send).toHaveBeenCalledWith(expect.any(SendEmailCommand));
  });

  it('should log and throw error on sendEmail failure', async () => {
    const error = new Error('SES send failed');
    sesClientMock.send.mockRejectedValue(error);

    await expect(service.sendEmail(to, subject, htmlContent, plainText)).rejects.toThrow(error);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      AwsErrorMessages.SES.SEND_EMAIL_ERROR(to, subject),
      error,
    );
  });
});
*/
