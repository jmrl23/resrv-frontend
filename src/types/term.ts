export const Term = {
  FIRST: 'FIRST',
  SECOND: 'SECOND'
}

export type Term = typeof Term[keyof typeof Term]
