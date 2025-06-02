import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate as isUuidValid } from 'uuid';

import { ValidationErrorMessages } from '../constants/error-messages/validation-error-messages';

@Injectable()
export class ParseUuidPipe implements PipeTransform<string> {
  transform(value: unknown): string {
    if (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      throw new BadRequestException(ValidationErrorMessages.UUID.REQUIRED);
    }

    if (typeof value !== 'string') {
      throw new BadRequestException(ValidationErrorMessages.UUID.MUST_BE_STRING);
    }

    if (!isUuidValid(value)) {
      throw new BadRequestException(ValidationErrorMessages.UUID.INVALID_TYPE(value));
    }

    return value;
  }
}
