import type { MessageWithParams } from 'src/common/types/message-with-params.type';

type AwsErrorMessagesType = {
  DYNAMO_DB: {
    GET_ERROR: string;
    PUT_ERROR: string;
    QUERY_ERROR: string;
    DELETE_ERROR: string;
    UPDATE_ERROR: string;
  };
  S3: {
    UPLOAD_FILE_ERROR: MessageWithParams<[string]>;
    DELETE_FILE_ERROR: MessageWithParams<[string]>;
    UPLOAD_BASE64_FILE_ERROR: MessageWithParams<[string]>;
  };
  SES: {
    SEND_EMAIL_ERROR: MessageWithParams<[string[], string]>;
  };
};

export const AwsErrorMessages: AwsErrorMessagesType = {
  DYNAMO_DB: {
    GET_ERROR: 'DynamoDB Get Error.',
    PUT_ERROR: 'DynamoDB Put Error.',
    QUERY_ERROR: 'DynamoDB Query Error.',
    DELETE_ERROR: 'DynamoDB Delete Error.',
    UPDATE_ERROR: 'DynamoDB Update Error.',
  },
  S3: {
    UPLOAD_FILE_ERROR: (key: string) => `S3 uploadFile error for key: ${key}`,
    DELETE_FILE_ERROR: (key: string) => `S3 deleteFile error for key: ${key}`,
    UPLOAD_BASE64_FILE_ERROR: (key: string) => `S3 uploadBase64File error for key: ${key}`,
  },
  SES: {
    SEND_EMAIL_ERROR: (to: string[], subject: string) =>
      `SES sendEmail error. Recipients: [${to.join(', ')}], Subject: "${subject}"`,
  },
} as const;
