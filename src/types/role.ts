export const Role = {
  ADMIN: 'ADMIN',
  REGISTRY: 'REGISTRY',
  STUDENT: 'STUDENT'
}

export type Role = typeof Role[keyof typeof Role]
