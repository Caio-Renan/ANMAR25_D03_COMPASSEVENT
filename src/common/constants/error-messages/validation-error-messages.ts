import type { MessageWithParams } from 'src/common/types/message-with-params.type';

type ValidationErrorMessagesType = {
  EMAIL: {
    REQUIRED: string;
    INVALID_TYPE: string;
    TOO_LONG: MessageWithParams<[number]>;
  };
  PHONE_NUMBER: {
    REQUIRED: string;
    INVALID_TYPE: string;
    MUST_START_WITH_PLUS: string;
  };
  BASE64_IMAGE: {
    REQUIRED: string;
    LENGTH_MULTIPLE_OF_4: string;
    INVALID: string;
  };
  GENERIC_DATE: {
    INVALID_TYPE: string;
    INVALID_VALUE: MessageWithParams<[unknown]>;
  };
  GENERIC_STRING: {
    REQUIRED: string;
    NOT_EMPTY: string;
    TOO_SHORT: MessageWithParams<[number]>;
    TOO_LONG: MessageWithParams<[number]>;
  };
  PASSWORD: {
    REQUIRED: string;
    INVALID_TYPE: string;
    LENGTH: MessageWithParams<[number, number]>;
    NO_SPACES_ALLOWED: string;
    MUST_CONTAIN_LETTERS_AND_NUMBERS: string;
  };
  NAME: {
    REQUIRED: string;
    INVALID_TYPE: string;
    TOO_LONG: MessageWithParams<[number]>;
    INVALID_CHARACTERS: string;
  };
  VALID_INT: {
    NOT_A_NUMBER: MessageWithParams<[unknown]>;
    NOT_A_INTEGER: MessageWithParams<[unknown]>;
    TOO_SMALL: MessageWithParams<[unknown]>;
    TOO_LARGE: MessageWithParams<[unknown]>;
  };
  VALID_ID: {
    NOT_A_NUMBER: MessageWithParams<[unknown]>;
    NOT_A_INTEGER: MessageWithParams<[unknown]>;
    TOO_SMALL: MessageWithParams<[unknown]>;
    TOO_LARGE: MessageWithParams<[unknown]>;
  };
};

export const ValidationErrorMessages: ValidationErrorMessagesType = {
  EMAIL: {
    REQUIRED: 'Email is required.',
    INVALID_TYPE: 'Invalid email format.',
    TOO_LONG: (maxLength: number) => `Email must be at most ${maxLength} characters long.`,
  },
  PHONE_NUMBER: {
    REQUIRED: 'Phone number is required.',
    INVALID_TYPE: 'Invalid phone number format.',
    MUST_START_WITH_PLUS: 'Phone number must start with "+".',
  },
  BASE64_IMAGE: {
    REQUIRED: 'Base64Image must be a non-empty string.',
    LENGTH_MULTIPLE_OF_4: 'Base64Image length must be a multiple of 4.',
    INVALID: 'Base64Image must be a valid base64 string.',
  },
  GENERIC_DATE: {
    INVALID_TYPE:
      'Invalid type: value must be a Date object, a date string, or a timestamp number.',
    INVALID_VALUE: (value: unknown) => `${value} is not a valid date.`,
  },
  GENERIC_STRING: {
    REQUIRED: 'Value must be a string.',
    NOT_EMPTY: 'String cannot be empty.',
    TOO_SHORT: (minLength: number) => `String must be at least ${minLength} characters long.`,
    TOO_LONG: (maxLength: number) => `String must be at most ${maxLength} characters long.`,
  },
  PASSWORD: {
    REQUIRED: 'Password is required.',
    INVALID_TYPE: 'Password must be a string.',
    LENGTH: (minLength: number, maxLength: number) =>
      `Password must be between ${minLength} and ${maxLength} characters.`,
    NO_SPACES_ALLOWED: 'Password should not contain spaces.',
    MUST_CONTAIN_LETTERS_AND_NUMBERS: 'Password must contain letters and numbers.',
  },
  NAME: {
    REQUIRED: 'Name is required.',
    INVALID_TYPE: 'Name must be a string.',
    TOO_LONG: (maxLength: number) => `Name must be at most ${maxLength} characters long.`,
    INVALID_CHARACTERS: 'Name must contain only letters, spaces, dots, apostrophes, or hyphens.',
  },
  VALID_INT: {
    NOT_A_NUMBER: (value: unknown) => `Value '${value}' is not a number.`,
    NOT_A_INTEGER: (value: unknown) => `Value '${value}' must be an integer.`,
    TOO_SMALL: (value: unknown) => `Value '${value}' must be greater than or equal to 1.`,
    TOO_LARGE: (value: unknown) =>
      `Value '${value}' must be less than or equal to ${Number.MAX_SAFE_INTEGER}.`,
  },
  VALID_ID: {} as ValidationErrorMessagesType['VALID_INT'],
} as const;

ValidationErrorMessages.VALID_ID = ValidationErrorMessages.VALID_INT;
