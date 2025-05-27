import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsDomain(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDomain',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        },
        defaultMessage() {
          return 'Неверный формат домена';
        },
      },
    });
  };
}