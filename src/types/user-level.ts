import { Role } from './role'
import { User } from './user'

export type UserLevel = {
  id: string
  dateCreated: Date
  lastUpdated: Date
  email: string
  role: Role
  User?: User
}
