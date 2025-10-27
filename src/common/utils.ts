import { registerDecorator, ValidationOptions } from 'class-validator';

// 이메일 형식 검증
export const EmailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

// 사용자 지정 Json 타입 검증
// 참고: https://stackoverflow.com/questions/76834738/nestjs-postgresql-dto-store-jsonb-gives-must-be-a-json-string-error
export function IsJsonObject(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isJsonObject',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value === 'string') {
            try {
              const parsed = JSON.parse(value);
              // Ensure the parsed value is an object and not an array or null
              return (
                parsed !== null &&
                typeof parsed === 'object' &&
                !Array.isArray(parsed)
              );
            } catch (e) {
              console.error(e);
              return false;
            }
          } else if (
            typeof value === 'object' &&
            value !== null &&
            !Array.isArray(value)
          ) {
            // Directly validate objects (but not arrays or null)
            return true;
          }
          return false;
        },
      },
    });
  };
}

// Boolean 타입 검증 (dto 단에서 boolean 검증을 못하는 문제)
// 참고: https://ilikezzi.tistory.com/26
export function valueToBoolean(value: string) {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (['true', 'on', 'yes', '1'].includes(value.toLowerCase())) {
    return true;
  }
  if (['false', 'off', 'no', '0'].includes(value.toLowerCase())) {
    return false;
  }
  return value;
}
