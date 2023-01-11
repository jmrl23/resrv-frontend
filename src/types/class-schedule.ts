import { Day } from './day'

export type CourseSchedule = {
  id: string
  dateCreated: Date
  lastUpdated: Date
  day: Day | null
  from: Date | null
  to: Date | null
  classSectionId: string
  courseId: string
}
