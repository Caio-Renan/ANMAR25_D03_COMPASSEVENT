import { phoneNumberValidator } from '@utils/phone-number.util';
import type { ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNumber',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: phoneNumberValidator,
    });
  };
}
