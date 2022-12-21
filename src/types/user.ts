import { StudentInformation } from './student-information'
import { UserLevel } from './user-level'

export type User = {
  id: string
  dateCreated: Date
  lastUpdated: Date
  isDisabled: boolean
  email: string
  givenName?: string
  familyName?: string
  displayName?: string
  picture?: string
  userLevelId: string | null
  UserLevel: UserLevel
  StudentInformation?: StudentInformation
}
