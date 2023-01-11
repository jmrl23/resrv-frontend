import { Gender } from './gender'
import { StudentType } from './student-type'

export type StudentInformation = {
  id: string
  dateCreated: Date
  lastUpdated: Date
  studentType: StudentType
  gender: Gender
  address: string
  contactNumber: string | null
  studentId: string | null
  userId: string
  programId: string
  classSectionId: string
}
