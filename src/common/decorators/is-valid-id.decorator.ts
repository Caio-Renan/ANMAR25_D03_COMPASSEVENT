import { IsValidInt } from './is-valid-int.decorator';
import type { ValidationOptions } from 'class-validator';

export function IsValidId(validationOptions?: ValidationOptions) {
  return IsValidInt(validationOptions);
}
