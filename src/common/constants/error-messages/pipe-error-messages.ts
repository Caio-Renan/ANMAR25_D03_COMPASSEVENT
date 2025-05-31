import type { MessageWithParams } from 'src/common/types/message-with-params.type';

type PipeErrorMessagesType = {
  UUID: {
    REQUIRED: string;
    MUST_BE_STRING: string;
    INVALID_TYPE: MessageWithParams<[unknown]>;
  };
};

export const PipeErrorMessages: PipeErrorMessagesType = {
  UUID: {
    REQUIRED: 'UUID is required and cannot be empty',
    MUST_BE_STRING: 'UUID must be a string',
    INVALID_TYPE: (value: unknown) => `'${value}' is not a valid UUID`,
  },
} as const;
