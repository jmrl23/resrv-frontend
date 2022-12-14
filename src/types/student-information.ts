import { Gender } from './gender'

export type StudentInformation = {
  id: string
  dateCreated: Date
  lastUpdated: Date
  gender: Gender
  address: string
  contactNumber: string | null
  studentId: string | null
  userId: string
  departmentId: string
} | null
