import { StudentInformation } from './student-information'
import { UserLevel } from './user-level'

export type User = {
  id: string
  dateCreated: Date
  lastUpdated: Date
  isDisabled: boolean
  email: string
  givenName: string | null
  familyName: string | null
  displayName: string | null
  picture: string | null
  userLevelId: string | null
  UserLevel: UserLevel
  StudentInformation: StudentInformation
}
