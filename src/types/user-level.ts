import { Role } from './role'

export type UserLevel = {
  id: string
  dateCreated: Date
  lastUpdated: Date
  email: string
  role: Role
} | null
