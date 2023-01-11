import { ReservationStatus } from './reservation-status'

export type Reservation = {
  id: string
  dateCreated: Date
  lastUpdated: Date
  status: ReservationStatus
  fileId: string | null
  studentInformationId: string | null
}
