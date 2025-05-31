import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate as isUuidValid } from 'uuid';

import { PipeErrorMessages } from '../constants/error-messages/pipe-error-messages';

@Injectable()
export class ParseUuidPipe implements PipeTransform<string> {
  transform(value: unknown): string {
    if (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      throw new BadRequestException(PipeErrorMessages.UUID.REQUIRED);
    }

    if (typeof value !== 'string') {
      throw new BadRequestException(PipeErrorMessages.UUID.MUST_BE_STRING);
    }

    if (!isUuidValid(value)) {
      throw new BadRequestException(PipeErrorMessages.UUID.INVALID_TYPE(value));
    }

    return value;
  }
}
