export enum RequiredString {
  M = 'должен',
  F = 'должна',
  A = 'должно',
}

export enum LengthString {
  L = 'более',
  S = 'менее',
}

export const ZOD_BASE_ERROR_MESSAGES = {
  REUIRED: 'Обязательное поле',
  LENGTH: (
    fieldName: string,
    requiredString: RequiredString,
    lengthString: LengthString,
    length: number,
  ) =>
    `${fieldName} ${requiredString} быть не ${lengthString} ${length} символов`,
} as const;

export const ZOD_AUTH_ERROR_MESSAGES = {
  INVALID_EMAIL: 'Некорректный формат почты',
} as const;

