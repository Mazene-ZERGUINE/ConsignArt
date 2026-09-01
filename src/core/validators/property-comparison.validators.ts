import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isAfterOrEqualDate', async: false })
class IsAfterOrEqualDateConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints as [string];
    const relatedValue = (args.object as Record<string, unknown>)[relatedPropertyName];
    if (typeof value !== 'string' || typeof relatedValue !== 'string') return true;

    const date = new Date(value);
    const relatedDate = new Date(relatedValue);
    if (Number.isNaN(date.getTime()) || Number.isNaN(relatedDate.getTime())) return true;

    return date.getTime() >= relatedDate.getTime();
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints as [string];
    return `${args.property} must be on or after ${relatedPropertyName}`;
  }
}

/** Validates that a date-string property is on or after another date-string property on the same object, when both are present. */
export function IsAfterOrEqualDate(property: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsAfterOrEqualDateConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isLessThanOrEqualProperty', async: false })
class IsLessThanOrEqualPropertyConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints as [string];
    const relatedValue = (args.object as Record<string, unknown>)[relatedPropertyName];
    if (typeof value !== 'number' || typeof relatedValue !== 'number') return true;

    return value <= relatedValue;
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints as [string];
    return `${args.property} must be less than or equal to ${relatedPropertyName}`;
  }
}

/** Validates that a numeric property is less than or equal to another numeric property on the same object, when both are present. */
export function IsLessThanOrEqualProperty(property: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsLessThanOrEqualPropertyConstraint,
    });
  };
}
