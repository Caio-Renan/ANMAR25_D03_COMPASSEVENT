import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { ValidationErrorMessages } from '../constants/error-messages/validation-error-messages';
import { Uuid } from '../value-objects';

@Injectable()
export class ParseUuidToValueObjectPipe implements PipeTransform<string, Uuid> {
  transform(value: string): Uuid {
    try {
      return new Uuid(value);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : ValidationErrorMessages.UUID.INVALID_TYPE;
      throw new BadRequestException(message);
    }
  }
}
