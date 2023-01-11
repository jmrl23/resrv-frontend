export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  NON_BINARY: 'NON_BINARY'
}

export type Gender = typeof Gender[keyof typeof Gender]
