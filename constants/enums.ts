// Valores válidos para os campos que no PlantUML são enums.
// Como SQLite não suporta enums no Prisma 5, os campos no schema são `String`
// e a validação acontece no controller usando estas constantes.

export const GENDER_CHOICES = [
  'MASCULINO',
  'FEMININO',
  'NAO_ESPECIFICADO',
] as const;
export type GenderChoice = (typeof GENDER_CHOICES)[number];

export const MEAL_CHOICES = [
  'snack',
  'lunch',
  'breakfast',
  'dinner',
  'other',
] as const;
export type MealChoice = (typeof MEAL_CHOICES)[number];

export const LEVEL_CHOICES = [
  'SEDENTARIO',
  'LEVEMENTE_ATIVO',
  'MODERADAMENTE_ATIVO',
  'MUITO_ATIVO',
  'EXTREMAMENTE_ATIVO',
] as const;
export type LevelChoice = (typeof LEVEL_CHOICES)[number];
